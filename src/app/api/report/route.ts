import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  getReportSummaries,
  toggleHideEntry,
  isValidYouTubeId,
} from "@/lib/reports";

export const runtime = "nodejs";

const ADMIN_PASSWORD = "YMKY1130";

function getDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

function verifyPassword(providedPassword: unknown): boolean {
  return typeof providedPassword === "string" && providedPassword === ADMIN_PASSWORD;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      password?: unknown;
      action?: unknown;
      videoId?: unknown;
      hide?: unknown;
    };

    const headerPassword = request.headers.get("x-report-password");
    const password = headerPassword || payload.password;

    if (!verifyPassword(password)) {
      return Response.json(
        { success: false, error: "unauthorized" },
        { status: 401 },
      );
    }

    const database = getDatabase();
    const action = payload.action;

    if (action === "list") {
      const reports = await getReportSummaries(database);
      return Response.json({ success: true, reports });
    }

    if (action === "toggle-hide") {
      const videoId = typeof payload.videoId === "string" ? payload.videoId.trim() : "";
      const hide = Boolean(payload.hide);

      if (!isValidYouTubeId(videoId)) {
        return Response.json(
          { success: false, error: "invalid_video_id" },
          { status: 400 },
        );
      }

      const success = await toggleHideEntry(database, videoId, hide);
      if (!success) {
        return Response.json(
          { success: false, error: "database_error" },
          { status: 500 },
        );
      }

      const reports = await getReportSummaries(database);
      return Response.json({ success: true, reports });
    }

    return Response.json(
      { success: false, error: "invalid_action" },
      { status: 400 },
    );
  } catch {
    return Response.json(
      { success: false, error: "invalid_request" },
      { status: 400 },
    );
  }
}
