export type ReportSummary = {
  videoId: string;
  count: number;
  lastReportedAt: number;
  isHidden: boolean;
};

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function isValidYouTubeId(value: unknown): value is string {
  return typeof value === "string" && YOUTUBE_ID_PATTERN.test(value);
}

export async function recordReport(
  database: D1Database,
  videoId: string,
): Promise<boolean> {
  if (!isValidYouTubeId(videoId)) return false;

  try {
    const now = Date.now();
    await database
      .prepare(
        "INSERT INTO reports (video_id, created_at) VALUES (?1, ?2)",
      )
      .bind(videoId, now)
      .run();
    return true;
  } catch (error) {
    console.error("Failed to record report:", error);
    return false;
  }
}

export async function getHiddenVideoIds(database: D1Database): Promise<Set<string>> {
  try {
    const { results } = await database
      .prepare("SELECT video_id FROM hidden_entries")
      .all<{ video_id: string }>();

    return new Set((results || []).map((row) => row.video_id));
  } catch {
    return new Set();
  }
}

export async function getReportSummaries(database: D1Database): Promise<ReportSummary[]> {
  try {
    const { results: reports } = await database
      .prepare(
        `SELECT video_id, COUNT(*) as count, MAX(created_at) as last_reported_at
         FROM reports
         GROUP BY video_id
         ORDER BY count DESC, last_reported_at DESC`,
      )
      .all<{ video_id: string; count: number; last_reported_at: number }>();

    const hiddenSet = await getHiddenVideoIds(database);

    return (reports || []).map((row) => ({
      videoId: row.video_id,
      count: Number(row.count),
      lastReportedAt: Number(row.last_reported_at),
      isHidden: hiddenSet.has(row.video_id),
    }));
  } catch (error) {
    console.error("Failed to fetch report summaries:", error);
    return [];
  }
}

export async function toggleHideEntry(
  database: D1Database,
  videoId: string,
  hide: boolean,
): Promise<boolean> {
  if (!isValidYouTubeId(videoId)) return false;

  try {
    if (hide) {
      await database
        .prepare(
          "INSERT OR IGNORE INTO hidden_entries (video_id, created_at) VALUES (?1, ?2)",
        )
        .bind(videoId, Date.now())
        .run();
    } else {
      await database
        .prepare("DELETE FROM hidden_entries WHERE video_id = ?1")
        .bind(videoId)
        .run();
    }
    return true;
  } catch (error) {
    console.error("Failed to toggle hide entry:", error);
    return false;
  }
}
