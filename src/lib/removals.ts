import "server-only";
import { timingSafeEqual } from "node:crypto";
import { isValidYouTubeId } from "./reports";
import { readLimitedJsonResponse } from "./request-json";
import { consumeSlidingWindowRateLimit, pruneExpiredSecurityRows } from "./security";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const CODE_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 10 * 60 * 1000;
const EMAIL_COOLDOWN_MS = 60 * 1000;
const EMAIL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const IP_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const IP_DAILY_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_EMAIL_REQUESTS_PER_HOUR = 3;
const MAX_IP_REQUESTS_PER_WINDOW = 5;
const MAX_IP_REQUESTS_PER_DAY = 20;
const MAX_ATTEMPTS = 5;

type RemovalRequestRow = {
  id: string;
  email_hash: string;
  code_hash: string;
  video_ids: string;
  expires_at: number;
  attempts: number;
  used_at: number | null;
};

type RemovalSessionRow = {
  email_hash: string;
  video_ids: string;
  expires_at: number;
  used_at: number | null;
};

export type RemovalSummary = {
  videoId: string;
  removedAt: number;
  isHidden: boolean;
};

async function sendRemovalCodeWithResend(args: {
  apiKey: string;
  from: string;
  to: string;
  code: string;
  requestId: string;
}): Promise<void> {
  const { apiKey, from, to, code, requestId } = args;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `removal-code/${requestId}`,
      "User-Agent": "ymkw-vote/0.1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "動画削除申請の確認コード",
      text: `確認コード: ${code}\n有効期限: 10分`,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Resend returned ${response.status}`);
  }
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmac(secret: string, value: string): Promise<string> {
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

async function constantTimeEqual(left: string, right: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  return timingSafeEqual(new Uint8Array(leftHash), new Uint8Array(rightHash));
}

function createCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte & 31]).join("");
}

function createToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function parseVideoIds(value: string): string[] {
  try {
    const values = JSON.parse(value) as unknown;
    return Array.isArray(values)
      ? values.filter((item): item is string => isValidYouTubeId(item))
      : [];
  } catch {
    return [];
  }
}

async function lookupVideoIds(args: {
  email: string;
  feedUrl: string;
  lookupSecret: string;
}): Promise<string[]> {
  const { email, feedUrl, lookupSecret } = args;
  const response = await fetch(feedUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "lookupByEmail", email, secret: lookupSecret }),
    redirect: "follow",
    signal: AbortSignal.timeout(20_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Entry lookup returned ${response.status}`);

  const value = await readLimitedJsonResponse(response, 32 * 1024);
  const payload =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as { success?: unknown; videoIds?: unknown })
      : {};
  if (payload.success !== true || !Array.isArray(payload.videoIds)) {
    throw new Error("Entry lookup returned an invalid response");
  }

  return [...new Set(payload.videoIds.filter(isValidYouTubeId))].slice(0, 20);
}

async function excludeHiddenVideoIds(
  database: D1Database,
  videoIds: string[],
): Promise<string[]> {
  if (videoIds.length === 0) return [];
  const placeholders = videoIds.map(() => "?").join(", ");
  const { results } = await database
    .prepare(`SELECT video_id FROM hidden_entries WHERE video_id IN (${placeholders})`)
    .bind(...videoIds)
    .all<{ video_id: string }>();
  const hidden = new Set((results || []).map((row) => row.video_id));
  return videoIds.filter((videoId) => !hidden.has(videoId));
}

async function isRateLimited(
  database: D1Database,
  emailHash: string,
  ip: string,
  now: number,
): Promise<boolean> {
  const limits = [
    await consumeSlidingWindowRateLimit({
      database,
      scope: "removal-email-minute",
      keyHash: emailHash,
      limit: 1,
      windowMs: EMAIL_COOLDOWN_MS,
      now,
    }),
    await consumeSlidingWindowRateLimit({
      database,
      scope: "removal-email-hour",
      keyHash: emailHash,
      limit: MAX_EMAIL_REQUESTS_PER_HOUR,
      windowMs: EMAIL_RATE_LIMIT_WINDOW_MS,
      now,
    }),
    await consumeSlidingWindowRateLimit({
      database,
      scope: "removal-ip-window",
      keyHash: ip,
      limit: MAX_IP_REQUESTS_PER_WINDOW,
      windowMs: IP_RATE_LIMIT_WINDOW_MS,
      now,
    }),
    await consumeSlidingWindowRateLimit({
      database,
      scope: "removal-ip-day",
      keyHash: ip,
      limit: MAX_IP_REQUESTS_PER_DAY,
      windowMs: IP_DAILY_WINDOW_MS,
      now,
    }),
  ];
  return limits.some((limit) => !limit.allowed);
}

export async function createRemovalRequest(args: {
  database: D1Database;
  resendApiKey: string;
  email: string;
  ip: string;
  secret: string;
  from: string;
}): Promise<{ requestId: string; rateLimited: boolean }> {
  const { database, resendApiKey, email, ip, secret, from } = args;
  const now = Date.now();
  const emailHash = await hmac(secret, `email:${email}`);
  const ipHash = await hmac(secret, `ip:${ip}`);
  const requestId = crypto.randomUUID();

  await pruneExpiredSecurityRows(database, now);
  await database
    .prepare("DELETE FROM removal_requests WHERE expires_at < ?1 AND created_at < ?2")
    .bind(now, now - 24 * 60 * 60 * 1000)
    .run();
  await database
    .prepare("DELETE FROM removal_sessions WHERE expires_at < ?1")
    .bind(now)
    .run();

  if (await isRateLimited(database, emailHash, ipHash, now)) {
    return { requestId, rateLimited: true };
  }

  const code = createCode();
  const codeHash = await hmac(secret, `code:${requestId}:${code}`);
  await database
    .prepare(
      `INSERT INTO removal_requests
       (id, email_hash, code_hash, video_ids, created_at, expires_at, attempts, requested_ip)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7)`,
    )
    .bind(
      requestId,
      emailHash,
      codeHash,
      "[]",
      now,
      now + CODE_TTL_MS,
      ipHash,
    )
    .run();

  try {
    await sendRemovalCodeWithResend({
      apiKey: resendApiKey,
      to: email,
      from,
      code,
      requestId,
    });
  } catch (error) {
    console.error("Failed to send removal verification email", error);
  }

  return { requestId, rateLimited: false };
}

export async function verifyRemovalCode(args: {
  database: D1Database;
  requestId: string;
  code: string;
  email: string;
  secret: string;
  feedUrl: string;
  lookupSecret: string;
}): Promise<{ success: true; sessionToken: string; videoIds: string[] } | { success: false }> {
  const { database, requestId, code, email, secret, feedUrl, lookupSecret } = args;
  const now = Date.now();
  const row = await database
    .prepare(
      `SELECT id, email_hash, code_hash, video_ids, expires_at, attempts, used_at
       FROM removal_requests WHERE id = ?1`,
    )
    .bind(requestId)
    .first<RemovalRequestRow>();

  if (!row || row.used_at || row.expires_at < now || row.attempts >= MAX_ATTEMPTS) {
    return { success: false };
  }

  const [providedCodeHash, providedEmailHash] = await Promise.all([
    hmac(secret, `code:${requestId}:${code.toUpperCase()}`),
    hmac(secret, `email:${email}`),
  ]);
  const [codeMatches, emailMatches] = await Promise.all([
    constantTimeEqual(row.code_hash, providedCodeHash),
    constantTimeEqual(row.email_hash, providedEmailHash),
  ]);
  if (!codeMatches || !emailMatches) {
    await database
      .prepare(
        `UPDATE removal_requests
         SET attempts = attempts + 1
         WHERE id = ?1 AND used_at IS NULL AND expires_at >= ?2 AND attempts < ?3`,
      )
      .bind(requestId, now, MAX_ATTEMPTS)
      .run();
    return { success: false };
  }

  const videoIds = await excludeHiddenVideoIds(
    database,
    await lookupVideoIds({ email, feedUrl, lookupSecret }),
  );
  const sessionToken = createToken();
  const tokenHash = await hmac(secret, `session:${sessionToken}`);
  const claim = await database
    .prepare(
      `UPDATE removal_requests
       SET used_at = ?1, video_ids = ?2
       WHERE id = ?3 AND used_at IS NULL AND expires_at >= ?1 AND attempts < ?4`,
    )
    .bind(now, JSON.stringify(videoIds), requestId, MAX_ATTEMPTS)
    .run();
  if (claim.meta.changes !== 1) return { success: false };

  await database
    .prepare(
      `INSERT INTO removal_sessions
       (token_hash, email_hash, video_ids, created_at, expires_at)
       VALUES (?1, ?2, ?3, ?4, ?5)`,
    )
    .bind(tokenHash, row.email_hash, JSON.stringify(videoIds), now, now + SESSION_TTL_MS)
    .run();

  return { success: true, sessionToken, videoIds };
}

export async function confirmRemoval(args: {
  database: D1Database;
  sessionToken: string;
  videoIds: string[];
  secret: string;
}): Promise<boolean> {
  const { database, sessionToken, videoIds, secret } = args;
  const now = Date.now();
  const tokenHash = await hmac(secret, `session:${sessionToken}`);
  const row = await database
    .prepare(
      `SELECT email_hash, video_ids, expires_at, used_at
       FROM removal_sessions WHERE token_hash = ?1`,
    )
    .bind(tokenHash)
    .first<RemovalSessionRow>();

  if (!row || row.used_at || row.expires_at < now) return false;
  const allowed = new Set(parseVideoIds(row.video_ids));
  const selected = [...new Set(videoIds)].filter(
    (videoId) => isValidYouTubeId(videoId) && allowed.has(videoId),
  );
  if (selected.length === 0 || selected.length !== new Set(videoIds).size) return false;

  const claim = await database
    .prepare(
      `UPDATE removal_sessions
       SET used_at = ?1
       WHERE token_hash = ?2 AND used_at IS NULL AND expires_at >= ?1`,
    )
    .bind(now, tokenHash)
    .run();
  if (claim.meta.changes !== 1) return false;

  const statements = selected.flatMap((videoId) => [
    database
      .prepare("INSERT OR IGNORE INTO hidden_entries (video_id, created_at) VALUES (?1, ?2)")
      .bind(videoId, now),
    database
      .prepare(
        "INSERT INTO removal_records (video_id, email_hash, created_at) VALUES (?1, ?2, ?3)",
      )
      .bind(videoId, row.email_hash, now),
  ]);
  await database.batch(statements);
  return true;
}

export async function getRemovalSummaries(database: D1Database): Promise<RemovalSummary[]> {
  const { results } = await database
    .prepare(
      `SELECT r.video_id, MAX(r.created_at) AS removed_at,
              CASE WHEN h.video_id IS NULL THEN 0 ELSE 1 END AS is_hidden
       FROM removal_records r
       LEFT JOIN hidden_entries h ON h.video_id = r.video_id
       GROUP BY r.video_id, h.video_id
       ORDER BY removed_at DESC`,
    )
    .all<{ video_id: string; removed_at: number; is_hidden: number }>();

  return (results || []).map((row) => ({
    videoId: row.video_id,
    removedAt: Number(row.removed_at),
    isHidden: Boolean(row.is_hidden),
  }));
}
