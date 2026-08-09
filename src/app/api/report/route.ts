import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";
import {
  getReportSummaries,
  toggleHideEntry,
  isValidYouTubeId,
} from "@/lib/reports";
import { getRemovalSummaries } from "@/lib/removals";
import { readLimitedJsonObject } from "@/lib/request-json";
import {
  assertSameOrigin,
  constantTimeEqual,
  consumeFixedWindowRateLimit,
  createSecureToken,
  getTrustedClientIp,
  hmacHex,
  pruneExpiredSecurityRows,
  requireSecuritySecret,
} from "@/lib/security";

export const runtime = "nodejs";

const REPORT_SESSION_COOKIE = "ymkw_report_session";
const REPORT_SESSION_MAX_AGE = 8 * 60 * 60;
const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function getDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

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

async function verifyPassword(providedPassword: unknown): Promise<boolean> {
  const expectedHash = process.env.REPORT_PASSWORD_HASH;
  if (
    typeof providedPassword !== "string" ||
    !providedPassword ||
    providedPassword.length > 256 ||
    !expectedHash ||
    !/^[0-9a-f]{64}$/i.test(expectedHash)
  ) {
    return false;
  }
  return constantTimeEqual(await sha256Hex(providedPassword), expectedHash.toLowerCase());
}

async function getAuthorizedSession(
  request: NextRequest,
  database: D1Database,
  secret: string,
): Promise<{ token: string; tokenHash: string } | null> {
  const token = request.cookies.get(REPORT_SESSION_COOKIE)?.value;
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
  const [reports, removals] = await Promise.all([
    getReportSummaries(database),
    getRemovalSummaries(database),
  ]);
  return { reports, removals };
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
      const rateLimit = await consumeFixedWindowRateLimit({
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
      if (!(await verifyPassword(payload.password))) {
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
        .bind(tokenHash, now, now + REPORT_SESSION_MAX_AGE * 1000)
        .run();

      const response = json({ success: true, ...(await getDashboardData(database)) });
      response.cookies.set(REPORT_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: REPORT_SESSION_MAX_AGE,
      });
      return response;
    }

    const session = await getAuthorizedSession(request, database, secret);
    if (!session) {
      const response = json({ success: false, error: "unauthorized" }, { status: 401 });
      response.cookies.delete(REPORT_SESSION_COOKIE);
      return response;
    }

    if (action === "logout") {
      await database
        .prepare("DELETE FROM report_admin_sessions WHERE token_hash = ?1")
        .bind(session.tokenHash)
        .run();
      const response = json({ success: true });
      response.cookies.delete(REPORT_SESSION_COOKIE);
      return response;
    }

    if (action === "list") {
      return json({ success: true, ...(await getDashboardData(database)) });
    }

    if (action === "toggle-hide") {
      const videoId = typeof payload.videoId === "string" ? payload.videoId.trim() : "";
      const hide = payload.hide;

      if (!isValidYouTubeId(videoId) || typeof hide !== "boolean") {
        return json({ success: false, error: "invalid_request" }, { status: 400 });
      }

      const success = await toggleHideEntry(database, videoId, hide);
      if (!success) {
        return json({ success: false, error: "database_error" }, { status: 500 });
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
