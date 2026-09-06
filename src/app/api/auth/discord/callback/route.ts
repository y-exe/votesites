import { timingSafeEqual } from "node:crypto";
import { getDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  authCookieOptions,
  createDiscordSessionToken,
  DISCORD_OAUTH_RETURN_COOKIE,
  DISCORD_OAUTH_STATE_COOKIE,
  DISCORD_SESSION_COOKIE,
  DISCORD_SESSION_MAX_AGE,
  discordRedirectUri,
  safeReturnPath,
  hashDiscordSessionToken,
} from "@/lib/discord-auth";
import { readLimitedJsonResponse } from "@/lib/request-json";

export const runtime = "nodejs";

type DiscordTokenResponse = { access_token?: string; token_type?: string };
type DiscordUserResponse = {
  id?: string;
  username?: string;
  global_name?: string | null;
  avatar?: string | null;
};

function statesMatch(received: string | null, stored: string | undefined) {
  if (!received || !stored) return false;
  const receivedBuffer = Buffer.from(received);
  const storedBuffer = Buffer.from(stored);
  return (
    receivedBuffer.length === storedBuffer.length &&
    timingSafeEqual(receivedBuffer, storedBuffer)
  );
}

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(DISCORD_OAUTH_STATE_COOKIE)?.value;
  const returnTo = safeReturnPath(
    request.cookies.get(DISCORD_OAUTH_RETURN_COOKIE)?.value,
  );

  const finish = (response: NextResponse) => {
    response.cookies.delete(DISCORD_OAUTH_STATE_COOKIE);
    response.cookies.delete(DISCORD_OAUTH_RETURN_COOKIE);
    response.headers.set("Cache-Control", "no-store");
    return response;
  };
  const errorRedirect = (reason: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://event.ymkw.top";
    const target = new URL(returnTo, baseUrl);
    target.searchParams.set("auth", reason);
    return finish(NextResponse.redirect(target));
  };

  if (!clientId || !clientSecret || !process.env.AUTH_SECRET) {
    return errorRedirect("configuration_error");
  }
  if (!code || !statesMatch(state, storedState)) {
    return errorRedirect("invalid_state");
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: discordRedirectUri(request.url),
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return errorRedirect("token_exchange_failed");

    const token = (await readLimitedJsonResponse(
      tokenResponse,
      16 * 1024,
    )) as DiscordTokenResponse;
    if (!token.access_token || token.token_type?.toLowerCase() !== "bearer") {
      return errorRedirect("invalid_token_response");
    }

    const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bearer ${token.access_token}` },
      cache: "no-store",
    });
    if (!userResponse.ok) return errorRedirect("profile_fetch_failed");

    const user = (await readLimitedJsonResponse(
      userResponse,
      32 * 1024,
    )) as DiscordUserResponse;
    if (!user.id || !user.username) return errorRedirect("invalid_profile");

    const sessionToken = createDiscordSessionToken();
    const now = Date.now();
    await getDatabase()
      .prepare(
        `INSERT INTO discord_sessions
         (token_hash, discord_user_id, username, global_name, avatar, created_at, expires_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`,
      )
      .bind(
        hashDiscordSessionToken(sessionToken),
        user.id,
        user.username,
        user.global_name ?? null,
        user.avatar ?? null,
        now,
        now + DISCORD_SESSION_MAX_AGE * 1000,
      )
      .run();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://event.ymkw.top";
    const response = NextResponse.redirect(new URL(returnTo, baseUrl));
    response.cookies.set(DISCORD_SESSION_COOKIE, sessionToken, {
      ...authCookieOptions,
      maxAge: DISCORD_SESSION_MAX_AGE,
    });
    return finish(response);
  } catch (err) {
    console.error("Discord Auth Error:", err);
    return errorRedirect("discord_unavailable");
  }
}
