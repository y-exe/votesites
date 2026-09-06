import { getDatabase } from '@/lib/db';
import { NextRequest } from "next/server";
import {
  DISCORD_SESSION_COOKIE,
  getDiscordSession,
} from "@/lib/discord-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getDiscordSession(
    getDatabase(),
    request.cookies.get(DISCORD_SESSION_COOKIE)?.value,
  );
  return Response.json(
    session
      ? { authenticated: true, user: session.user, expiresAt: session.expiresAt }
      : { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
