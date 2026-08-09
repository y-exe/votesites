import "server-only";

import { timingSafeEqual } from "node:crypto";

const MIN_SECRET_LENGTH = 32;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function requireSecuritySecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error("AUTH_SECRET must contain at least 32 characters");
  }
  return secret;
}

export async function hmacHex(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(new Uint8Array(signature));
}

export async function constantTimeEqual(left: string, right: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  return timingSafeEqual(new Uint8Array(leftHash), new Uint8Array(rightHash));
}

export function createSecureToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Buffer.from(bytes).toString("base64url");
}

export function getTrustedClientIp(request: Request): string {
  const value = request.headers.get("cf-connecting-ip")?.trim();
  return value && value.length <= 64 ? value : "unknown";
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    throw new Error("Same-origin request required");
  }
}

export async function consumeFixedWindowRateLimit(args: {
  database: D1Database;
  scope: string;
  keyHash: string;
  limit: number;
  windowMs: number;
  now?: number;
}): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const { database, scope, keyHash, limit, windowMs } = args;
  const now = args.now ?? Date.now();
  const bucket = Math.floor(now / windowMs);
  const expiresAt = (bucket + 1) * windowMs;

  const row = await database
    .prepare(
      `INSERT INTO api_rate_limits (scope, key_hash, bucket, count, expires_at)
       VALUES (?1, ?2, ?3, 1, ?4)
       ON CONFLICT(scope, key_hash, bucket) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(scope, keyHash, bucket, expiresAt)
    .first<{ count: number }>();

  return {
    allowed: Number(row?.count ?? limit + 1) <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt - now) / 1000)),
  };
}

export async function pruneExpiredSecurityRows(
  database: D1Database,
  now = Date.now(),
): Promise<void> {
  await database.batch([
    database.prepare("DELETE FROM api_rate_limits WHERE expires_at < ?1").bind(now),
    database.prepare("DELETE FROM report_admin_sessions WHERE expires_at < ?1").bind(now),
  ]);
}
