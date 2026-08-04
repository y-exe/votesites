import { getCloudflareContext } from "@opennextjs/cloudflare";
import { recordReport, isValidYouTubeId } from "@/lib/reports";

export const runtime = "nodejs";

function getDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "127.0.0.1";
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
    const clientIp = getClientIp(request);
    const result = await recordReport(database, videoId, clientIp);

    if (!result.success) {
      if (result.error === "already_reported") {
        return Response.json(
          { success: false, error: "already_reported" },
          { status: 409 },
        );
      }
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
