import "server-only";

import { readLimitedJsonResponse } from "./request-json";

export type ContestEntry = {
  id: string;
  youtubeId: string;
  submittedAt?: string;
  viewCount?: number;
};

type FeedEntry = {
  youtubeId?: unknown;
  submittedAt?: unknown;
  viewCount?: unknown;
};

type EntryCacheRow = {
  payload: string;
  updated_at: number;
};

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const ENTRY_CACHE_TTL_MS = 5 * 60 * 1000;
const ENTRY_FETCH_TIMEOUT_MS = 7_000;

type EntryFeedResult = {
  entries: ContestEntry[];
  configured: boolean;
};

export function isYouTubeId(value: unknown): value is string {
  return typeof value === "string" && YOUTUBE_ID_PATTERN.test(value);
}

function normalizeEntries(payload: { entries?: FeedEntry[] }): ContestEntry[] {
  const seen = new Set<string>();
  return (Array.isArray(payload.entries) ? payload.entries : [])
    .flatMap((entry) => {
      const youtubeId =
        typeof entry.youtubeId === "string" ? entry.youtubeId.trim() : "";

      if (!isYouTubeId(youtubeId) || seen.has(youtubeId)) return [];

      seen.add(youtubeId);
      const submittedAt =
        typeof entry.submittedAt === "string" &&
        Number.isFinite(Date.parse(entry.submittedAt))
          ? entry.submittedAt
          : undefined;
      const parsedViewCount =
        typeof entry.viewCount === "number" || typeof entry.viewCount === "string"
          ? Number(entry.viewCount)
          : Number.NaN;
      const viewCount =
        Number.isSafeInteger(parsedViewCount) && parsedViewCount >= 0
          ? parsedViewCount
          : undefined;

      return [{ id: youtubeId, youtubeId, submittedAt, viewCount }];
    })
    .slice(0, 200);
}

type YouTubeVideoResource = {
  id?: unknown;
  snippet?: { publishedAt?: unknown };
  statistics?: { viewCount?: unknown };
};

async function enrichWithYouTubeMetadata(
  entries: ContestEntry[],
): Promise<ContestEntry[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || entries.length === 0) return entries;

  const metadata = new Map<
    string,
    { publishedAt?: string; viewCount?: number }
  >();
  const batches = Array.from(
    { length: Math.ceil(entries.length / 50) },
    (_, index) => entries.slice(index * 50, (index + 1) * 50),
  );

  const results = await Promise.allSettled(
    batches.map(async (batch) => {
      const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
      endpoint.searchParams.set("part", "snippet,statistics");
      endpoint.searchParams.set("id", batch.map((entry) => entry.youtubeId).join(","));
      endpoint.searchParams.set("key", apiKey);
      const response = await fetch(endpoint, {
        next: { revalidate: 300 },
        signal: AbortSignal.timeout(ENTRY_FETCH_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`YouTube API returned ${response.status}`);

      const value = await readLimitedJsonResponse(response, 512 * 1024);
      const items =
        value && typeof value === "object" && !Array.isArray(value)
          ? (value as { items?: YouTubeVideoResource[] }).items
          : undefined;
      return Array.isArray(items) ? items : [];
    }),
  );

  results.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.forEach((video) => {
      if (typeof video.id !== "string") return;
      const publishedAt =
        typeof video.snippet?.publishedAt === "string" &&
        Number.isFinite(Date.parse(video.snippet.publishedAt))
          ? video.snippet.publishedAt
          : undefined;
      const parsedViewCount = Number(video.statistics?.viewCount);
      const viewCount =
        Number.isSafeInteger(parsedViewCount) && parsedViewCount >= 0
          ? parsedViewCount
          : undefined;
      metadata.set(video.id, { publishedAt, viewCount });
    });
  });

  return entries.map((entry) => {
    const video = metadata.get(entry.youtubeId);
    return video
      ? {
          ...entry,
          submittedAt: entry.submittedAt ?? video.publishedAt,
          viewCount: video.viewCount ?? entry.viewCount,
        }
      : entry;
  });
}

async function readDatabaseCache(database: D1Database): Promise<{
  result: EntryFeedResult;
  updatedAt: number;
} | null> {
  try {
    const row = await database
      .prepare("SELECT payload, updated_at FROM entry_feed_cache WHERE id = 1")
      .first<EntryCacheRow>();

    if (!row) return null;
    const parsed = JSON.parse(row.payload) as { entries?: FeedEntry[] };
    return {
      result: { entries: normalizeEntries(parsed), configured: true },
      updatedAt: row.updated_at,
    };
  } catch (error) {
    console.warn(
      "Entry feed cache read failed",
      error instanceof Error ? error.message : "unknown",
    );
    return null;
  }
}

async function writeDatabaseCache(
  database: D1Database,
  result: EntryFeedResult,
  updatedAt: number,
) {
  try {
    await database
      .prepare(
        `INSERT INTO entry_feed_cache (id, payload, updated_at)
         VALUES (1, ?1, ?2)
         ON CONFLICT(id) DO UPDATE SET
           payload = excluded.payload,
           updated_at = excluded.updated_at`,
      )
      .bind(JSON.stringify({ entries: result.entries }), updatedAt)
      .run();
  } catch (error) {
    console.warn(
      "Entry feed cache write failed",
      error instanceof Error ? error.message : "unknown",
    );
  }
}

async function requestContestEntries(feedUrl: string): Promise<EntryFeedResult> {
  const response = await fetch(feedUrl, {
    next: { revalidate: 300 },
    redirect: "follow",
    signal: AbortSignal.timeout(ENTRY_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Entry feed returned ${response.status}`);
  }

  const value = await readLimitedJsonResponse(response, 512 * 1024);
  const payload =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as { entries?: FeedEntry[] })
      : {};
  const entries = await enrichWithYouTubeMetadata(normalizeEntries(payload));

  return { entries, configured: true };
}

import { getHiddenVideoIds } from "./reports";

async function filterHiddenEntries(
  database: D1Database | undefined,
  result: EntryFeedResult,
): Promise<EntryFeedResult> {
  if (!database || result.entries.length === 0) return result;
  const hiddenSet = await getHiddenVideoIds(database);
  if (hiddenSet.size === 0) return result;

  return {
    ...result,
    entries: result.entries.filter((entry) => !hiddenSet.has(entry.youtubeId)),
  };
}

export async function fetchContestEntries(
  database?: D1Database,
): Promise<EntryFeedResult> {
  const feedUrl = process.env.ENTRY_FEED_URL;

  if (!feedUrl) return { entries: [], configured: false };

  const now = Date.now();
  const databaseCache = database ? await readDatabaseCache(database) : null;
  if (databaseCache && now - databaseCache.updatedAt < ENTRY_CACHE_TTL_MS) {
    const enrichedResult = {
      ...databaseCache.result,
      entries: await enrichWithYouTubeMetadata(databaseCache.result.entries),
    };
    return filterHiddenEntries(database, enrichedResult);
  }

  try {
    const result = await requestContestEntries(feedUrl);
    if (database) await writeDatabaseCache(database, result, Date.now());
    return filterHiddenEntries(database, result);
  } catch (error) {
    if (databaseCache) {
      const enrichedResult = {
        ...databaseCache.result,
        entries: await enrichWithYouTubeMetadata(databaseCache.result.entries),
      };
      return filterHiddenEntries(database, enrichedResult);
    }
    throw error;
  }
}
