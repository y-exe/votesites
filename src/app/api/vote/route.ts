import { getDatabase } from '@/lib/db';
import { NextRequest } from "next/server";
import {
  DISCORD_SESSION_COOKIE,
  getDiscordSession,
} from "@/lib/discord-auth";
import { fetchContestEntries, isYouTubeId } from "@/lib/entries";
import { getVotingPhase } from "@/data/schedule";
import {
  consumeSlidingWindowRateLimit,
  evaluateVpnOrProxy,
  getClientNetworkInfo,
  getRequestOrigins,
  hmacHex,
  pruneExpiredSecurityRows,
  requireSecuritySecret,
} from "@/lib/security";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const MAX_BODY_BYTES = 512;

type VoteRow = {
  video_id: string;
};

function json(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  for (const [name, value] of Object.entries(JSON_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }

  return Response.json(body, {
    ...init,
    headers,
  });
}

async function getSession(request: NextRequest) {
  return getDiscordSession(
    getVotesDatabase(),
    request.cookies.get(DISCORD_SESSION_COOKIE)?.value,
  );
}

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return origin !== null && getRequestOrigins(request).has(origin);
}

async function readSmallJson(request: Request): Promise<unknown> {
  if (!request.body) throw new Error("missing_body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("body_too_large");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body));
}

function getVotesDatabase() {
  return getDatabase();
}

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) return json({ error: "authentication_required" }, { status: 401 });

  try {
    const vote = await getVotesDatabase()
      .prepare("SELECT video_id FROM votes WHERE discord_user_id = ?1")
      .bind(session.user.id)
      .first();

    return json({ vote: vote ? { videoId: vote.video_id } : null });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "vote lookup failed",
        error: error instanceof Error ? error.message : "unknown",
      }),
    );
    return json({ error: "vote_lookup_failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return json({ error: "invalid_origin" }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "invalid_content_type" }, { status: 415 });
  }

  const session = await getSession(request);
  if (!session) return json({ error: "authentication_required" }, { status: 401 });

  const votingPhase = getVotingPhase();
  if (votingPhase !== "open") {
    return json(
      { error: "voting_not_open", phase: votingPhase },
      { status: 403 },
    );
  }

  const cf = undefined;
  const networkInfo = getClientNetworkInfo(request, cf);
  const vpnCheck = evaluateVpnOrProxy(request, networkInfo);

  const database = getVotesDatabase();
  const secret = requireSecuritySecret();
  const rateLimit = await consumeSlidingWindowRateLimit({
    database,
    scope: "vote-user-minute",
    keyHash: await hmacHex(secret, `vote-user:${session.user.id}`),
    limit: 30,
    windowMs: 60 * 1000,
  });
  if (!rateLimit.allowed) {
    return json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await readSmallJson(request);
  } catch {
    return json({ error: "invalid_request" }, { status: 400 });
  }

  const videoId =
    typeof payload === "object" && payload !== null && "videoId" in payload
      ? Reflect.get(payload, "videoId")
      : null;
  if (!isYouTubeId(videoId)) {
    return json({ error: "invalid_video_id" }, { status: 400 });
  }

  try {
    const { entries, configured } = await fetchContestEntries(getVotesDatabase());
    if (!configured || !entries.some((entry) => entry.youtubeId === videoId)) {
      return json({ error: "entry_not_found" }, { status: 404 });
    }

    const currentVote = await database
      .prepare("SELECT video_id FROM votes WHERE discord_user_id = ?1")
      .bind(session.user.id)
      .first();

    if (currentVote?.video_id === videoId) {
      return json({ vote: { videoId }, action: "unchanged" });
    }

    const now = Date.now();
    await database
      .prepare(
        `INSERT INTO votes (
           discord_user_id,
           video_id,
           ip,
           user_agent,
           country,
           as_organization,
           asn,
           is_suspicious,
           suspicious_reason,
           threat_score,
           created_at,
           updated_at
         )
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
         ON CONFLICT(discord_user_id) DO UPDATE SET
           video_id = excluded.video_id,
           ip = excluded.ip,
           user_agent = excluded.user_agent,
           country = excluded.country,
           as_organization = excluded.as_organization,
           asn = excluded.asn,
           is_suspicious = excluded.is_suspicious,
           suspicious_reason = excluded.suspicious_reason,
           threat_score = excluded.threat_score,
           is_excluded = 0,
           excluded_at = NULL,
           updated_at = excluded.updated_at`,
      )
      .bind(
        session.user.id,
        videoId,
        networkInfo.ip,
        networkInfo.userAgent,
        networkInfo.country,
        networkInfo.asOrganization,
        networkInfo.asn,
        vpnCheck.isSuspicious ? 1 : 0,
        vpnCheck.reason ?? "",
        networkInfo.threatScore ?? null,
        now,
        now,
      )
      .run();

    return json({
      vote: { videoId },
      action: currentVote ? "moved" : "created",
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "vote write failed",
        error: error instanceof Error ? error.message : "unknown",
      }),
    );
    return json({ error: "vote_write_failed" }, { status: 500 });
  } finally {
    await pruneExpiredSecurityRows(database);
  }
}
