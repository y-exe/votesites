import { createHmac, randomBytes } from "node:crypto";

export const DISCORD_SESSION_COOKIE = "ymkw_discord_session";
export const DISCORD_OAUTH_STATE_COOKIE = "ymkw_discord_oauth_state";
export const DISCORD_OAUTH_RETURN_COOKIE = "ymkw_discord_oauth_return";
export const DISCORD_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type DiscordSession = {
  user: {
    id: string;
    username: string;
    globalName: string | null;
    avatar: string | null;
  };
  expiresAt: number;
};

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must contain at least 32 characters");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function createDiscordSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashDiscordSessionToken(token: string): string {
  return sign(`discord-session:${token}`);
}

export async function getDiscordSession(
  database: D1Database,
  token: string | undefined,
): Promise<DiscordSession | null> {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

  const row = await database
    .prepare(
      `SELECT discord_user_id, username, global_name, avatar, expires_at
       FROM discord_sessions WHERE token_hash = ?1 AND expires_at >= ?2`,
    )
    .bind(hashDiscordSessionToken(token), Date.now())
    .first<{
      discord_user_id: string;
      username: string;
      global_name: string | null;
      avatar: string | null;
      expires_at: number;
    }>();
  if (!row) return null;

  return {
    user: {
      id: row.discord_user_id,
      username: row.username,
      globalName: row.global_name,
      avatar: row.avatar,
    },
    expiresAt: Math.floor(row.expires_at / 1000),
  };
}

export function safeReturnPath(value: string | null | undefined) {
  if (!value || value.includes("\\") || /[\r\n]/.test(value)) return "/vote";
  try {
    const base = new URL("https://return-path.invalid");
    const target = new URL(value, base);
    if (target.origin !== base.origin) return "/vote";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/vote";
  }
}

export function discordRedirectUri(requestUrl: string) {
  return (
    process.env.DISCORD_REDIRECT_URI ??
    `${new URL(requestUrl).origin}/api/auth/discord/callback`
  );
}

export const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
