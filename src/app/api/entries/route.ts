type FeedEntry = {
  youtubeId?: unknown;
};

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export const dynamic = "force-dynamic";

export async function GET() {
  const feedUrl = process.env.ENTRY_FEED_URL;

  if (!feedUrl) {
    return Response.json(
      { entries: [], configured: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
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

        if (!YOUTUBE_ID_PATTERN.test(youtubeId) || seen.has(youtubeId)) {
          return [];
        }

        seen.add(youtubeId);
        return [{ id: youtubeId, youtubeId }];
      })
      .slice(0, 200);

    return Response.json(
      { entries, configured: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { entries: [], configured: true, error: "entry_feed_unavailable" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
