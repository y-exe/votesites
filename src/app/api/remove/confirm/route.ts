import { getCloudflareContext } from "@opennextjs/cloudflare";
import { confirmRemoval } from "@/lib/removals";
import { readLimitedJsonObject } from "@/lib/request-json";
import { assertSameOrigin } from "@/lib/security";

export const runtime = "nodejs";
const RESPONSE_HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const payload = await readLimitedJsonObject(request);
    const sessionToken = typeof payload.sessionToken === "string" ? payload.sessionToken : "";
    const videoIds = Array.isArray(payload.videoIds)
      ? payload.videoIds.filter((value): value is string => typeof value === "string")
      : [];
    const secret = process.env.REMOVE_CODE_SECRET;

    if (!secret || secret.length < 32) {
      return Response.json(
        { success: false, error: "service_unavailable" },
        { status: 503, headers: RESPONSE_HEADERS },
      );
    }
    if (!/^[A-Za-z0-9_-]{43}$/.test(sessionToken) || videoIds.length === 0 || videoIds.length > 20) {
      return Response.json(
        { success: false, error: "invalid_request" },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    const success = await confirmRemoval({
      database: getCloudflareContext().env.VOTES_DB,
      sessionToken,
      videoIds,
      secret,
    });
    if (!success) {
      return Response.json(
        { success: false, error: "invalid_session" },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    return Response.json(
      { success: true, removedCount: videoIds.length },
      { headers: RESPONSE_HEADERS },
    );
  } catch {
    return Response.json(
      { success: false, error: "invalid_request" },
      { status: 400, headers: RESPONSE_HEADERS },
    );
  }
}
