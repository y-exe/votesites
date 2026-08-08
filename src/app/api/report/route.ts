import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  getReportSummaries,
  toggleHideEntry,
  isValidYouTubeId,
} from "@/lib/reports";
import { getRemovalSummaries } from "@/lib/removals";

export const runtime = "nodejs";

const EXPECTED_PASSWORD_HASH =
  "2f11bf70add2518a3c218295612a992132459445ffd2e375db85402341b3d5f3";

function getDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

async function verifyPassword(providedPassword: unknown): Promise<boolean> {
  if (typeof providedPassword !== "string" || !providedPassword) return false;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(providedPassword);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex === EXPECTED_PASSWORD_HASH;
  } catch {
    return false;
  }
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

    const isAuth = await verifyPassword(password);
    if (!isAuth) {
      return Response.json(
        { success: false, error: "unauthorized" },
        { status: 401 },
      );
    }

    const database = getDatabase();
    const action = payload.action;

    if (action === "list") {
      const [reports, removals] = await Promise.all([
        getReportSummaries(database),
        getRemovalSummaries(database),
      ]);
      return Response.json({ success: true, reports, removals });
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

      const [reports, removals] = await Promise.all([
        getReportSummaries(database),
        getRemovalSummaries(database),
      ]);
      return Response.json({ success: true, reports, removals });
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
