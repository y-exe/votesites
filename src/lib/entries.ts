import "server-only";

import { readLimitedJsonResponse } from "./request-json";

export type ContestEntry = {
  id: string;
  youtubeId: string;
  submittedAt?: string;
  viewCount?: number;
  title?: string;
  channelTitle?: string;
  description?: string;
  channelIcon?: string;
};

type FeedEntry = {
  youtubeId?: unknown;
  submittedAt?: unknown;
  viewCount?: unknown;
  title?: unknown;
  channelTitle?: unknown;
  description?: unknown;
  channelIcon?: unknown;
};

type EntryCacheRow = {
  payload: string;
  updated_at: number;
};

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const ENTRY_CACHE_TTL_MS = 60 * 60 * 1000;
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
  if (!Array.isArray(payload.entries)) return [];
  return payload.entries
    .filter((entry): entry is FeedEntry & { youtubeId: string } => {
      if (typeof entry.youtubeId !== "string") return false;
      const youtubeId = entry.youtubeId.trim();
      if (!isYouTubeId(youtubeId) || seen.has(youtubeId)) return false;
      seen.add(youtubeId);
      return true;
    })
    .map((entry) => {
      const youtubeId = entry.youtubeId.trim();
      const submittedAt =
        typeof entry.submittedAt === "string" &&
        Number.isFinite(Date.parse(entry.submittedAt))
          ? entry.submittedAt
          : undefined;
      const parsedViewCount = Number(entry.viewCount);
      const viewCount =
        Number.isSafeInteger(parsedViewCount) && parsedViewCount >= 0
          ? parsedViewCount
          : undefined;

      const title = typeof entry.title === "string" ? entry.title : undefined;
      const channelTitle = typeof entry.channelTitle === "string" ? entry.channelTitle : undefined;
      const description = typeof entry.description === "string" ? entry.description : undefined;
      const channelIcon = typeof entry.channelIcon === "string" ? entry.channelIcon : undefined;

      return { id: youtubeId, youtubeId, submittedAt, viewCount, title, channelTitle, description, channelIcon };
    })
    .slice(0, 200);
}

type YouTubeVideoResource = {
  id?: unknown;
  snippet?: { publishedAt?: unknown; title?: unknown; channelTitle?: unknown; description?: unknown; channelId?: unknown };
  statistics?: { viewCount?: unknown };
};

type YouTubeChannelResource = {
  id?: unknown;
  snippet?: { thumbnails?: { default?: { url?: unknown } } };
};

async function enrichWithYouTubeMetadata(
  entries: ContestEntry[],
): Promise<ContestEntry[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || entries.length === 0) return entries;

  const entriesNeedingMetadata = entries.filter(
    (entry) => entry.viewCount === undefined || !entry.submittedAt || !entry.title || !entry.channelTitle || !entry.description || !entry.channelIcon,
  );
  if (entriesNeedingMetadata.length === 0) return entries;

  const metadata = new Map<
    string,
    { publishedAt?: string; viewCount?: number; title?: string; channelTitle?: string; description?: string; channelId?: string; channelIcon?: string }
  >();
  const batches = Array.from(
    { length: Math.ceil(entriesNeedingMetadata.length / 50) },
    (_, index) => entriesNeedingMetadata.slice(index * 50, (index + 1) * 50),
  );

  const results = await Promise.allSettled(
    batches.map(async (batch) => {
      const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
      endpoint.searchParams.set("part", "snippet,statistics,id");
      endpoint.searchParams.set("id", batch.map((entry) => entry.youtubeId).join(","));
      endpoint.searchParams.set("key", apiKey);
      const response = await fetch(endpoint, {
        next: { revalidate: 3600 },
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

  const channelIdsToFetch = new Set<string>();

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
      const title = typeof video.snippet?.title === "string" ? video.snippet.title : undefined;
      const channelTitle = typeof video.snippet?.channelTitle === "string" ? video.snippet.channelTitle : undefined;
      const description = typeof video.snippet?.description === "string" ? video.snippet.description : undefined;
      const channelId = typeof video.snippet?.channelId === "string" ? video.snippet.channelId : undefined;
      
      if (channelId) channelIdsToFetch.add(channelId);

      metadata.set(video.id, { publishedAt, viewCount, title, channelTitle, description, channelId });
    });
  });

  const channelIconMap = new Map<string, string>();
  if (channelIdsToFetch.size > 0) {
    const channelBatches = Array.from(
      { length: Math.ceil(channelIdsToFetch.size / 50) },
      (_, index) => Array.from(channelIdsToFetch).slice(index * 50, (index + 1) * 50),
    );
    const channelResults = await Promise.allSettled(
      channelBatches.map(async (batch) => {
        const endpoint = new URL("https://www.googleapis.com/youtube/v3/channels");
        endpoint.searchParams.set("part", "snippet");
        endpoint.searchParams.set("id", batch.join(","));
        endpoint.searchParams.set("key", apiKey);
        const response = await fetch(endpoint, {
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(ENTRY_FETCH_TIMEOUT_MS),
        });
        if (!response.ok) return [];
        const value = await readLimitedJsonResponse(response, 512 * 1024);
        const items =
          value && typeof value === "object" && !Array.isArray(value)
            ? (value as { items?: YouTubeChannelResource[] }).items
            : undefined;
        return Array.isArray(items) ? items : [];
      }),
    );
    channelResults.forEach((result) => {
      if (result.status !== "fulfilled") return;
      result.value.forEach((channel) => {
        if (typeof channel.id === "string" && typeof channel.snippet?.thumbnails?.default?.url === "string") {
          channelIconMap.set(channel.id, channel.snippet.thumbnails.default.url);
        }
      });
    });
  }

  return entries.map((entry) => {
    const video = metadata.get(entry.youtubeId);
    const channelIcon = video?.channelId ? channelIconMap.get(video.channelId) : undefined;
    return video
      ? {
          ...entry,
          submittedAt: entry.submittedAt ?? video.publishedAt,
          viewCount: video.viewCount ?? entry.viewCount,
          title: entry.title ?? video.title,
          channelTitle: entry.channelTitle ?? video.channelTitle,
          description: entry.description ?? video.description,
          channelIcon: entry.channelIcon ?? channelIcon,
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
    return true;
  } catch (error) {
    console.warn(
      "Entry feed cache write failed",
      error instanceof Error ? error.message : "unknown",
    );
    return false;
  }
}

async function claimDatabaseRefresh(
  database: D1Database,
  cachedAt: number,
  claimedAt: number,
) {
  try {
    const result = await database
      .prepare(
        "UPDATE entry_feed_cache SET updated_at = ?1 WHERE id = 1 AND updated_at = ?2",
      )
      .bind(claimedAt, cachedAt)
      .run();
    return result.meta.changes === 1;
  } catch (error) {
    console.warn(
      "Entry feed refresh claim failed",
      error instanceof Error ? error.message : "unknown",
    );
    return false;
  }
}

async function releaseDatabaseRefresh(
  database: D1Database,
  claimedAt: number,
  cachedAt: number,
) {
  try {
    await database
      .prepare(
        "UPDATE entry_feed_cache SET updated_at = ?1 WHERE id = 1 AND updated_at = ?2",
      )
      .bind(cachedAt, claimedAt)
      .run();
  } catch (error) {
    console.warn(
      "Entry feed refresh claim release failed",
      error instanceof Error ? error.message : "unknown",
    );
  }
}

async function requestContestEntries(feedUrl: string): Promise<EntryFeedResult> {
  const response = await fetch(feedUrl, {
    next: { revalidate: 3600 },
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
    return filterHiddenEntries(database, databaseCache.result);
  }

  let refreshClaimedAt: number | null = null;
  if (database && databaseCache) {
    refreshClaimedAt = Date.now();
    const claimed = await claimDatabaseRefresh(
      database,
      databaseCache.updatedAt,
      refreshClaimedAt,
    );
    if (!claimed) {
      return filterHiddenEntries(database, databaseCache.result);
    }
  }

  try {
    const result = await requestContestEntries(feedUrl);
    if (database) {
      const written = await writeDatabaseCache(database, result, Date.now());
      if (!written && databaseCache && refreshClaimedAt !== null) {
        await releaseDatabaseRefresh(
          database,
          refreshClaimedAt,
          databaseCache.updatedAt,
        );
      }
    }
    return filterHiddenEntries(database, result);
  } catch (error) {
    if (databaseCache) {
      if (database && refreshClaimedAt !== null) {
        await releaseDatabaseRefresh(
          database,
          refreshClaimedAt,
          databaseCache.updatedAt,
        );
      }
      return filterHiddenEntries(database, databaseCache.result);
    }
    throw error;
  }
}
