import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyRemovalCode } from "@/lib/removals";
import { readLimitedJsonObject } from "@/lib/request-json";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await readLimitedJsonObject(request);
    const requestId = typeof payload.requestId === "string" ? payload.requestId : "";
    const code = typeof payload.code === "string" ? payload.code.trim().toUpperCase() : "";
    const secret = process.env.REMOVE_CODE_SECRET;

    if (!secret || secret.length < 32) {
      return Response.json(
        { success: false, error: "service_unavailable" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        requestId,
      ) ||
      !/^[23456789A-HJ-NP-Z]{5}$/.test(code)
    ) {
      return Response.json(
        { success: false, error: "invalid_code" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const result = await verifyRemovalCode({
      database: getCloudflareContext().env.VOTES_DB,
      requestId,
      code,
      secret,
    });
    if (!result.success) {
      return Response.json(
        { success: false, error: "invalid_code" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { success: false, error: "invalid_request" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
