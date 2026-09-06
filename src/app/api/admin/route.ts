import { getDatabase } from '@/lib/db';

import { NextRequest, NextResponse } from "next/server";

import { getSuspiciousVotes, getVoteRankings, getRecentVotes } from "@/lib/admin";
import { getLiveResultsState, resetLiveResults } from "@/lib/live-results";
import { readLimitedJsonObject } from "@/lib/request-json";
import {
  assertSameOrigin,
  constantTimeEqual,
  consumeSlidingWindowRateLimit,
  createSecureToken,
  getTrustedClientIp,
  hmacHex,
  pruneExpiredSecurityRows,
  requireSecuritySecret,
} from "@/lib/security";

export const runtime = "nodejs";

const ADMIN_SESSION_COOKIE = "ymkw_admin_session";
const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;
const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};



function json(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...RESPONSE_HEADERS, ...Object.fromEntries(new Headers(init?.headers)) },
  });
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

const REPORT_PASSWORD_ITERATIONS = 100_000;

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64url");
}

async function createPasswordVerifier(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: REPORT_PASSWORD_ITERATIONS,
    },
    key,
    256,
  );
  return `pbkdf2-sha256$${REPORT_PASSWORD_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(new Uint8Array(bits))}`;
}

async function verifyPasswordVerifier(password: string, verifier: string): Promise<boolean> {
  const [algorithm, iterationsText, saltText, expected] = verifier.split("$");
  const iterations = Number(iterationsText);
  if (
    algorithm !== "pbkdf2-sha256" ||
    !Number.isInteger(iterations) ||
    iterations < 100_000 ||
    iterations > 2_000_000 ||
    !saltText ||
    !expected
  ) {
    return false;
  }
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: Buffer.from(saltText, "base64url"),
        iterations,
      },
      key,
      256,
    );
    return constantTimeEqual(toBase64Url(new Uint8Array(bits)), expected);
  } catch {
    return false;
  }
}

async function getPasswordVerifier(database: D1Database): Promise<string | null> {
  const row = await database
    .prepare("SELECT verifier FROM report_admin_credentials WHERE id = 1")
    .first<{ verifier: string }>();
  return row?.verifier ?? null;
}

async function verifyPassword(
  database: D1Database,
  providedPassword: unknown,
): Promise<{ valid: boolean; requiresUpgrade: boolean }> {
  if (
    typeof providedPassword !== "string" ||
    !providedPassword ||
    providedPassword.length > 256
  ) {
    return { valid: false, requiresUpgrade: false };
  }

  const verifier = await getPasswordVerifier(database);
  if (verifier) {
    return {
      valid: await verifyPasswordVerifier(providedPassword, verifier),
      requiresUpgrade: false,
    };
  }

  const expectedHash = process.env.REPORT_PASSWORD_HASH;
  if (
    !expectedHash ||
    !/^[0-9a-f]{64}$/i.test(expectedHash)
  ) {
    return { valid: false, requiresUpgrade: false };
  }
  return {
    valid: await constantTimeEqual(
      await sha256Hex(providedPassword),
      expectedHash.toLowerCase(),
    ),
    requiresUpgrade: true,
  };
}

async function getAuthorizedSession(
  request: NextRequest,
  database: D1Database,
  secret: string,
): Promise<{ token: string; tokenHash: string } | null> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;

  const tokenHash = await hmacHex(secret, `report-session:${token}`);
  const row = await database
    .prepare(
      "SELECT expires_at FROM report_admin_sessions WHERE token_hash = ?1 AND expires_at >= ?2",
    )
    .bind(tokenHash, Date.now())
    .first<{ expires_at: number }>();
  return row ? { token, tokenHash } : null;
}

async function getDashboardData(database: D1Database) {
  return {
    rankings: await getVoteRankings(database),
    recentVotes: await getRecentVotes(database),
    suspiciousVotes: await getSuspiciousVotes(database),
    liveResults: await getLiveResultsState(),
  };
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const payload = await readLimitedJsonObject(request, 2 * 1024);
    const action = payload.action;
    const database = getDatabase();
    const secret = requireSecuritySecret();

    if (action === "login") {
      await pruneExpiredSecurityRows(database);
      const ipHash = await hmacHex(
        secret,
        `report-admin-ip:${getTrustedClientIp(request)}`,
      );
      const rateLimit = await consumeSlidingWindowRateLimit({
        database,
        scope: "report-admin-login",
        keyHash: ipHash,
        limit: 5,
        windowMs: 15 * 60 * 1000,
      });
      if (!rateLimit.allowed) {
        return json(
          { success: false, error: "rate_limited" },
          {
            status: 429,
            headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
          },
        );
      }
      const passwordResult = await verifyPassword(database, payload.password);
      if (!passwordResult.valid) {
        return json({ success: false, error: "unauthorized" }, { status: 401 });
      }

      const token = createSecureToken();
      const tokenHash = await hmacHex(secret, `report-session:${token}`);
      const now = Date.now();
      await database
        .prepare(
          `INSERT INTO report_admin_sessions (token_hash, created_at, expires_at)
           VALUES (?1, ?2, ?3)`,
        )
        .bind(tokenHash, now, now + ADMIN_SESSION_MAX_AGE * 1000)
        .run();

      const response = json({
        success: true,
        requiresPasswordUpgrade: passwordResult.requiresUpgrade,
        ...(await getDashboardData(database)),
      });
      response.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: ADMIN_SESSION_MAX_AGE,
      });
      return response;
    }

    const session = await getAuthorizedSession(request, database, secret);
    if (!session) {
      const response = json({ success: false, error: "unauthorized" }, { status: 401 });
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }

    if (action === "logout") {
      await database
        .prepare("DELETE FROM report_admin_sessions WHERE token_hash = ?1")
        .bind(session.tokenHash)
        .run();
      const response = json({ success: true });
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }

    if (action === "list") {
      return json({
        success: true,
        requiresPasswordUpgrade: !(await getPasswordVerifier(database)),
        ...(await getDashboardData(database)),
      });
    }

    if (action === "reset-results-reveal") {
      await resetLiveResults();
      return json({
        success: true,
        requiresPasswordUpgrade: !(await getPasswordVerifier(database)),
        ...(await getDashboardData(database)),
      });
    }

    if (action === "upgrade-password") {
      const newPassword = payload.newPassword;
      if (typeof newPassword !== "string" || newPassword.length < 11 || newPassword.length > 256) {
        return json({ success: false, error: "invalid_password" }, { status: 400 });
      }
      await database
        .prepare(
          `INSERT INTO report_admin_credentials (id, verifier, updated_at)
           VALUES (1, ?1, ?2)
           ON CONFLICT(id) DO UPDATE SET verifier = excluded.verifier, updated_at = excluded.updated_at`,
        )
        .bind(await createPasswordVerifier(newPassword), Date.now())
        .run();
      return json({ success: true, requiresPasswordUpgrade: false, ...(await getDashboardData(database)) });
    }

    if (action === "set-vote-excluded") {
      const discordUserId = payload.discordUserId;
      const isExcluded = payload.isExcluded;
      if (
        typeof discordUserId !== "string" ||
        !/^\d{17,20}$/.test(discordUserId) ||
        typeof isExcluded !== "boolean"
      ) {
        return json({ success: false, error: "invalid_vote" }, { status: 400 });
      }

      const result = await database
        .prepare(
          `UPDATE votes
           SET is_excluded = ?1,
               excluded_at = CASE WHEN ?1 = 1 THEN ?2 ELSE NULL END
           WHERE discord_user_id = ?3`,
        )
        .bind(isExcluded ? 1 : 0, Date.now(), discordUserId)
        .run();
      if (result.meta.changes !== 1) {
        return json({ success: false, error: "vote_not_found" }, { status: 404 });
      }

      return json({ success: true, ...(await getDashboardData(database)) });
    }



    return json({ success: false, error: "invalid_action" }, { status: 400 });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "report admin request failed",
        error: error instanceof Error ? error.message : "unknown",
      }),
    );
    return json({ success: false, error: "invalid_request" }, { status: 400 });
  }
}
