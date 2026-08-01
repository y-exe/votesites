import { createHmac, timingSafeEqual } from "node:crypto";

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

export function createDiscordSession(user: DiscordSession["user"]) {
  const payload: DiscordSession = {
    user,
    expiresAt: Math.floor(Date.now() / 1000) + DISCORD_SESSION_MAX_AGE,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyDiscordSession(token: string | undefined): DiscordSession | null {
  if (!token) return null;

  const [encoded, suppliedSignature, ...rest] = token.split(".");
  if (!encoded || !suppliedSignature || rest.length > 0) return null;

  const supplied = Buffer.from(suppliedSignature);
  let expected: Buffer;
  try {
    expected = Buffer.from(sign(encoded));
  } catch {
    return null;
  }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as DiscordSession;
    if (
      !payload?.user ||
      typeof payload.user.id !== "string" ||
      typeof payload.user.username !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function safeReturnPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/vote";
  return value;
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
