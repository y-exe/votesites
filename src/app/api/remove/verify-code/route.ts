import { getDatabase } from '@/lib/db';

import { normalizeEmail, verifyRemovalCode } from "@/lib/removals";
import { readLimitedJsonObject } from "@/lib/request-json";
import { assertSameOrigin } from "@/lib/security";

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
    const requestId = typeof payload.requestId === "string" ? payload.requestId : "";
    const code = typeof payload.code === "string" ? payload.code.trim().toUpperCase() : "";
    const email = normalizeEmail(payload.email);
    const secret = process.env.REMOVE_CODE_SECRET;
    const feedUrl = process.env.ENTRY_FEED_URL;
    const lookupSecret = process.env.ENTRY_LOOKUP_SECRET;

    if (!secret || secret.length < 32 || !feedUrl || !lookupSecret) {
      return Response.json(
        { success: false, error: "service_unavailable" },
        { status: 503, headers: RESPONSE_HEADERS },
      );
    }
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        requestId,
      ) ||
      !/^[23456789A-HJ-NP-Z]{5}$/.test(code) ||
      !email
    ) {
      return Response.json(
        { success: false, error: "invalid_code" },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    const result = await verifyRemovalCode({
      database: getDatabase(),
      requestId,
      code,
      email,
      secret,
      feedUrl,
      lookupSecret,
    });
    if (!result.success) {
      return Response.json(
        { success: false, error: "invalid_code" },
        { status: 400, headers: RESPONSE_HEADERS },
      );
    }

    return Response.json(result, { headers: RESPONSE_HEADERS });
  } catch (error) {
    console.error("Failed to verify removal code", error);
    return Response.json(
      { success: false, error: "service_unavailable" },
      { status: 503, headers: RESPONSE_HEADERS },
    );
  }
}
