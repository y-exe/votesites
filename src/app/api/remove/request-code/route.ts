import { getDatabase } from '@/lib/db';
import { createRemovalRequest, normalizeEmail } from "@/lib/removals";
import { readLimitedJsonObject } from "@/lib/request-json";
import { assertSameOrigin, getTrustedClientIp } from "@/lib/security";

export const runtime = "nodejs";
const RESPONSE_HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    assertSameOrigin(request);
    payload = await readLimitedJsonObject(request);
  } catch {
    return Response.json(
      { success: false, error: "invalid_request" },
      { status: 400, headers: RESPONSE_HEADERS },
    );
  }

  try {
    const email = normalizeEmail(payload.email);
    if (!email) {
      return Response.json(
        { success: false, error: "invalid_email" },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    const secret = process.env.REMOVE_CODE_SECRET;
    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_EMAIL_FROM;
    if (!secret || secret.length < 32 || !resendApiKey || !from) {
      console.error("Removal email settings are not configured");
      return Response.json(
        { success: false, error: "service_unavailable" },
        { status: 503, headers: RESPONSE_HEADERS },
      );
    }

    const env = process.env;
    const result = await createRemovalRequest({
      database: getDatabase(),
      resendApiKey,
      email,
      ip: getTrustedClientIp(request),
      secret,
      from,
    });

    if (result.rateLimited) {
      return Response.json(
        { success: false, error: "rate_limited" },
        { status: 429, headers: { ...RESPONSE_HEADERS, "Retry-After": "60" } },
      );
    }

    return Response.json(
      { success: true, requestId: result.requestId },
      { headers: RESPONSE_HEADERS },
    );
  } catch (error) {
    console.error("Failed to create removal request", error);
    return Response.json(
      { success: false, error: "service_unavailable" },
      { status: 503, headers: RESPONSE_HEADERS },
    );
  }
}
