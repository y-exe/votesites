import { NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  DISCORD_SESSION_COOKIE,
  getDiscordSession,
} from "@/lib/discord-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const session = await getDiscordSession(
    getCloudflareContext().env.VOTES_DB,
    request.cookies.get(DISCORD_SESSION_COOKIE)?.value,
  );
  return Response.json(
    session
      ? { authenticated: true, user: session.user, expiresAt: session.expiresAt }
      : { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
}
