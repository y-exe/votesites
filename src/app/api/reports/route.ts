import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchContestEntries } from "@/lib/entries";
import { recordReport, isValidYouTubeId } from "@/lib/reports";
import { readLimitedJsonObject } from "@/lib/request-json";
import {
  assertSameOrigin,
  consumeSlidingWindowRateLimit,
  getTrustedClientIp,
  hmacHex,
  pruneExpiredSecurityRows,
  requireSecuritySecret,
} from "@/lib/security";

export const runtime = "nodejs";

function getDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    ...init,
    headers: { ...RESPONSE_HEADERS, ...Object.fromEntries(new Headers(init?.headers)) },
  });
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readLimitedJsonObject(request, 512);
    const videoId = typeof payload.videoId === "string" ? payload.videoId.trim() : "";

    if (!isValidYouTubeId(videoId)) {
      return json(
        { success: false, error: "invalid_video_id" },
        { status: 400 },
      );
    }

    const database = getDatabase();
    const ipHash = await hmacHex(
      requireSecuritySecret(),
      `report-ip:${getTrustedClientIp(request)}`,
    );
    const [hourly, daily] = await Promise.all([
      consumeSlidingWindowRateLimit({
        database,
        scope: "report-hour",
        keyHash: ipHash,
        limit: 10,
        windowMs: 60 * 60 * 1000,
      }),
      consumeSlidingWindowRateLimit({
        database,
        scope: "report-day",
        keyHash: ipHash,
        limit: 30,
        windowMs: 24 * 60 * 60 * 1000,
      }),
    ]);
    if (!hourly.allowed || !daily.allowed) {
      return json(
        { success: false, error: "rate_limited" },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.max(hourly.retryAfterSeconds, daily.retryAfterSeconds)),
          },
        },
      );
    }

    const { entries, configured } = await fetchContestEntries(database);
    if (!configured || !entries.some((entry) => entry.youtubeId === videoId)) {
      return json({ success: false, error: "entry_not_found" }, { status: 404 });
    }

    const result = await recordReport(database, videoId, ipHash);

    if (!result.success) {
      if (result.error === "already_reported") {
        return json(
          { success: false, error: "already_reported" },
          { status: 409 },
        );
      }
      return json(
        { success: false, error: "database_error" },
        { status: 500 },
      );
    }

    await pruneExpiredSecurityRows(database);
    return json({ success: true });
  } catch {
    return json(
      { success: false, error: "invalid_request" },
      { status: 400 },
    );
  }
}
