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

export async function consumeSlidingWindowRateLimit(args: {
  database: D1Database;
  scope: string;
  keyHash: string;
  limit: number;
  windowMs: number;
  now?: number;
}): Promise<{ allowed: boolean; retryAfterSeconds: number; eventId?: string }> {
  const { database, scope, keyHash, limit, windowMs } = args;
  const now = args.now ?? Date.now();
  const expiresAt = now + windowMs;
  const eventId = crypto.randomUUID();

  const row = await database
    .prepare(
      `INSERT INTO api_rate_limit_events (id, scope, key_hash, created_at, expires_at)
       SELECT ?1, ?2, ?3, ?4, ?5
       WHERE (
         SELECT COUNT(*)
         FROM api_rate_limit_events
         WHERE scope = ?2 AND key_hash = ?3 AND created_at > ?6
       ) < ?7
       RETURNING id`,
    )
    .bind(eventId, scope, keyHash, now, expiresAt, now - windowMs, limit)
    .first<{ id: string }>();

  return {
    allowed: Boolean(row?.id),
    retryAfterSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
    ...(row?.id ? { eventId: row.id } : {}),
  };
}

export async function releaseSlidingWindowRateLimitEvents(
  database: D1Database,
  eventIds: string[],
): Promise<void> {
  if (eventIds.length === 0) return;
  await database.batch(
    eventIds.map((eventId) =>
      database.prepare("DELETE FROM api_rate_limit_events WHERE id = ?1").bind(eventId),
    ),
  );
}

export async function pruneExpiredSecurityRows(
  database: D1Database,
  now = Date.now(),
): Promise<void> {
  await database.batch([
    database.prepare("DELETE FROM api_rate_limits WHERE expires_at < ?1").bind(now),
    database.prepare("DELETE FROM api_rate_limit_events WHERE expires_at < ?1").bind(now),
    database.prepare("DELETE FROM report_admin_sessions WHERE expires_at < ?1").bind(now),
  ]);
}
