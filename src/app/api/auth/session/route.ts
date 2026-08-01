import { NextRequest } from "next/server";
import {
  DISCORD_SESSION_COOKIE,
  verifyDiscordSession,
} from "@/lib/discord-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = verifyDiscordSession(
    request.cookies.get(DISCORD_SESSION_COOKIE)?.value,
  );
  return Response.json(
    session
      ? { authenticated: true, user: session.user, expiresAt: session.expiresAt }
      : { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
