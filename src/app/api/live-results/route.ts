import { NextRequest } from "next/server";

import { getDatabase } from "@/lib/db";
import { DISCORD_SESSION_COOKIE, getDiscordSession } from "@/lib/discord-auth";
import { advanceLiveResults, getLiveResultsState } from "@/lib/live-results";
import { readLimitedJsonObject } from "@/lib/request-json";
import { assertSameOrigin } from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRODUCER_DISCORD_IDS = new Set(["1213362372014772255", "483307286513582090"]);
const HEADERS = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };

export async function GET(request: NextRequest) {
  const session = await getDiscordSession(
    getDatabase(),
    request.cookies.get(DISCORD_SESSION_COOKIE)?.value,
  );
  return Response.json({
    ...(await getLiveResultsState()),
    canAdvance: Boolean(session && PRODUCER_DISCORD_IDS.has(session.user.id)),
  }, { headers: HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const payload = await readLimitedJsonObject(request, 512);
    if (payload.action !== "advance" || !Number.isInteger(payload.rank)) {
      return Response.json({ error: "invalid_action" }, { status: 400, headers: HEADERS });
    }
    const session = await getDiscordSession(
      getDatabase(),
      request.cookies.get(DISCORD_SESSION_COOKIE)?.value,
    );
    if (!session || !PRODUCER_DISCORD_IDS.has(session.user.id)) {
      return Response.json({ error: "forbidden" }, { status: 403, headers: HEADERS });
    }
    return Response.json(await advanceLiveResults(payload.rank as number), { headers: HEADERS });
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400, headers: HEADERS });
  }
}
