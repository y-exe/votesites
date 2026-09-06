import { getDatabase } from "@/lib/db";
import { fetchContestEntries } from "@/lib/entries";
import { getLiveResultsState } from "@/lib/live-results";

export const runtime = "nodejs";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

type RankingRow = {
  videoId: string;
  count: number;
};

export async function GET() {
  try {
    const database = getDatabase() as D1Database;
    const [liveState, ranking, entriesResult] = await Promise.all([
      getLiveResultsState(),
      database
        .prepare(
          "SELECT video_id AS videoId, COUNT(*) AS count FROM votes WHERE is_excluded = 0 GROUP BY video_id"
        )
        .all<RankingRow>(),
      fetchContestEntries(database),
    ]);

    const counts = new Map(ranking.results.map((row) => [row.videoId, row.count]));

    const ranked = entriesResult.entries
      .map((entry) => ({
        videoId: entry.youtubeId,
        count: counts.get(entry.youtubeId) || 0,
        title: entry.title,
        channelTitle: entry.channelTitle,
        channelIcon: entry.channelIcon
          ? `/api/channel-icon?src=${encodeURIComponent(entry.channelIcon)}`
          : undefined,
        description: entry.description,
      }))
      .sort((a, b) => {
        if (a.count !== b.count) {
          return b.count - a.count; // 票が多い順 (降順)
        }
        return 0; // 同票なら順位はそのまま
      });

    const isFullyPublished = liveState.publishedRanks.length >= 10;
    const exposedRanked = isFullyPublished
      ? ranked
      : liveState.publishedRanks
        .map((slot) => ranked[slot - 1])
        .filter((item): item is (typeof ranked)[number] => Boolean(item))
        .map((item, index) => ({ ...item, slot: liveState.publishedRanks[index] }));

    return Response.json(
      {
        total: ranked.reduce((sum, row) => sum + row.count, 0),
        publishedCount: liveState.publishedCount,
        publishedRanks: liveState.publishedRanks,
        ranked: exposedRanked,
      },
      { headers: RESPONSE_HEADERS },
    );
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "results fetch failed",
        error: error instanceof Error ? error.message : "unknown",
      }),
    );
    return Response.json(
      { error: "results_unavailable" },
      { status: 500, headers: RESPONSE_HEADERS },
    );
  }
}
