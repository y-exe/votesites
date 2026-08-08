import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createRemovalRequest, normalizeEmail } from "@/lib/removals";
import { readLimitedJsonObject } from "@/lib/request-json";

export const runtime = "nodejs";

function getClientIp(request: Request): string {
  const cloudflareIp = request.headers.get("cf-connecting-ip");
  return cloudflareIp?.trim() || "unknown";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await readLimitedJsonObject(request);
  } catch {
    return Response.json(
      { success: false, error: "invalid_request" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const email = normalizeEmail(payload.email);
    if (!email) {
      return Response.json(
        { success: false, error: "invalid_email" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const secret = process.env.REMOVE_CODE_SECRET;
    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_EMAIL_FROM;
    if (!secret || secret.length < 32 || !resendApiKey || !from) {
      console.error("Removal email settings are not configured");
      return Response.json(
        { success: false, error: "service_unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    const { env } = getCloudflareContext();
    const result = await createRemovalRequest({
      database: env.VOTES_DB,
      resendApiKey,
      email,
      ip: getClientIp(request),
      secret,
      from,
    });

    if (result.rateLimited) {
      return Response.json(
        { success: false, error: "rate_limited" },
        { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "60" } },
      );
    }

    return Response.json(
      { success: true, requestId: result.requestId },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Failed to create removal request", error);
    return Response.json(
      { success: false, error: "service_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
