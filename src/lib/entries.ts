export type ContestEntry = {
  id: string;
  youtubeId: string;
};

type FeedEntry = {
  youtubeId?: unknown;
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

let lastSuccessfulResult: EntryFeedResult | null = null;
let lastSuccessfulAt = 0;
let pendingRequest: Promise<EntryFeedResult> | null = null;

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
      return [{ id: youtubeId, youtubeId }];
    })
    .slice(0, 200);
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

  const payload = (await response.json()) as { entries?: FeedEntry[] };
  const entries = normalizeEntries(payload);

  return { entries, configured: true };
}

export async function fetchContestEntries(
  database?: D1Database,
): Promise<EntryFeedResult> {
  const feedUrl = process.env.ENTRY_FEED_URL;

  if (!feedUrl) return { entries: [], configured: false };

  const now = Date.now();
  if (lastSuccessfulResult && now - lastSuccessfulAt < ENTRY_CACHE_TTL_MS) {
    return lastSuccessfulResult;
  }

  const databaseCache = database ? await readDatabaseCache(database) : null;
  if (databaseCache && now - databaseCache.updatedAt < ENTRY_CACHE_TTL_MS) {
    lastSuccessfulResult = databaseCache.result;
    lastSuccessfulAt = databaseCache.updatedAt;
    return databaseCache.result;
  }

  pendingRequest ??= requestContestEntries(feedUrl)
    .then(async (result) => {
      const updatedAt = Date.now();
      lastSuccessfulResult = result;
      lastSuccessfulAt = updatedAt;
      if (database) await writeDatabaseCache(database, result, updatedAt);
      return result;
    })
    .finally(() => {
      pendingRequest = null;
    });

  try {
    return await pendingRequest;
  } catch (error) {
    if (databaseCache) return databaseCache.result;
    if (lastSuccessfulResult) return lastSuccessfulResult;
    throw error;
  }
}
