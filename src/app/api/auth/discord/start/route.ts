import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  authCookieOptions,
  DISCORD_OAUTH_RETURN_COOKIE,
  DISCORD_OAUTH_STATE_COOKIE,
  discordRedirectUri,
  safeReturnPath,
} from "@/lib/discord-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return Response.json(
      { error: "discord_oauth_not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const state = randomBytes(32).toString("base64url");
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get("returnTo"));
  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("scope", "identify");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("redirect_uri", discordRedirectUri(request.url));

  const response = NextResponse.redirect(authorizeUrl);
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(DISCORD_OAUTH_STATE_COOKIE, state, {
    ...authCookieOptions,
    maxAge: 60 * 10,
  });
  response.cookies.set(DISCORD_OAUTH_RETURN_COOKIE, returnTo, {
    ...authCookieOptions,
    maxAge: 60 * 10,
  });
  return response;
}
