import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/security";
import { DISCORD_SESSION_COOKIE, hashDiscordSessionToken } from "@/lib/discord-auth";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const token = request.cookies.get(DISCORD_SESSION_COOKIE)?.value;
    if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) {
      await getCloudflareContext().env.VOTES_DB
        .prepare("DELETE FROM discord_sessions WHERE token_hash = ?1")
        .bind(hashDiscordSessionToken(token))
        .run();
    }
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  const response = NextResponse.json(
    { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.delete(DISCORD_SESSION_COOKIE);
  return response;
}
