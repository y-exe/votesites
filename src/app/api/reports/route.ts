import { getCloudflareContext } from "@opennextjs/cloudflare";
import { recordReport, isValidYouTubeId } from "@/lib/reports";

export const runtime = "nodejs";

function getDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { videoId?: unknown };
    const videoId = typeof payload.videoId === "string" ? payload.videoId.trim() : "";

    if (!isValidYouTubeId(videoId)) {
      return Response.json(
        { success: false, error: "invalid_video_id" },
        { status: 400 },
      );
    }

    const database = getDatabase();
    const success = await recordReport(database, videoId);

    if (!success) {
      return Response.json(
        { success: false, error: "database_error" },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "invalid_request" },
      { status: 400 },
    );
  }
}
