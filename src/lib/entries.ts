export type ContestEntry = {
  id: string;
  youtubeId: string;
};

type FeedEntry = {
  youtubeId?: unknown;
};

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function isYouTubeId(value: unknown): value is string {
  return typeof value === "string" && YOUTUBE_ID_PATTERN.test(value);
}

export async function fetchContestEntries(): Promise<{
  entries: ContestEntry[];
  configured: boolean;
}> {
  const feedUrl = process.env.ENTRY_FEED_URL;

  if (!feedUrl) return { entries: [], configured: false };

  const response = await fetch(feedUrl, {
    cache: "no-store",
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Entry feed returned ${response.status}`);
  }

  const payload = (await response.json()) as { entries?: FeedEntry[] };
  const seen = new Set<string>();
  const entries = (Array.isArray(payload.entries) ? payload.entries : [])
    .flatMap((entry) => {
      const youtubeId =
        typeof entry.youtubeId === "string" ? entry.youtubeId.trim() : "";

      if (!isYouTubeId(youtubeId) || seen.has(youtubeId)) return [];

      seen.add(youtubeId);
      return [{ id: youtubeId, youtubeId }];
    })
    .slice(0, 200);

  return { entries, configured: true };
}
