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

export type ClientNetworkInfo = {
  ip: string;
  userAgent: string;
  country: string;
  asOrganization: string;
  asn: number | null;
  threatScore?: number;
};

export function getClientNetworkInfo(
  request: Request,
  cf?: IncomingRequestCfProperties,
): ClientNetworkInfo {
  const ip = getTrustedClientIp(request);
  const userAgent = request.headers.get("user-agent")?.trim().slice(0, 512) || "";
  const headerCountry = request.headers.get("cf-ipcountry")?.trim().toUpperCase() || "";
  const country =
    typeof cf?.country === "string" && cf.country
      ? cf.country.toUpperCase()
      : headerCountry || "UNKNOWN";
  const asOrganization =
    typeof cf?.asOrganization === "string" ? cf.asOrganization.trim() : "";
  const rawAsn = cf?.asn;
  const asn = typeof rawAsn === "number" && Number.isSafeInteger(rawAsn) ? rawAsn : null;
  const threatScore =
    typeof cf?.threatScore === "number" && Number.isSafeInteger(cf.threatScore)
      ? cf.threatScore
      : undefined;

  return {
    ip,
    userAgent,
    country,
    asOrganization,
    asn,
    threatScore,
  };
}

const SUSPICIOUS_AS_KEYWORDS = [
  "amazon",
  "aws",
  "google cloud",
  "google llc",
  "microsoft",
  "azure",
  "digitalocean",
  "hetzner",
  "ovh",
  "vultr",
  "choopa",
  "linode",
  "akamai",
  "oracle",
  "alibaba",
  "tencent",
  "m247",
  "datacamp",
  "leaseweb",
  "cogent",
  "zenlayer",
  "hostinger",
  "hostkey",
  "serverius",
  "datapacket",
  "tzulo",
  "clouvider",
  "contabo",
  "kamatera",
  "ipvolume",
  "packethub",
  "shadow",
  "fly.io",
  "upcloud",
  "scaleway",
  "layerhost",
  "prolocation",
  "quadranet",
  "fastly",
  "cloudflare",
  "hostwinds",
  "tierpoint",
  "hivelocity",
  "hostpapa",
  "greencloud",
  "ionos",
  "strato",
  "nordvpn",
  "expressvpn",
  "surfshark",
  "mullvad",
  "proton",
  "private internet access",
  "windscribe",
  "cyberghost",
  "hide.me",
  "ipvanish",
  "purevpn",
  "tor exit",
  "vpn",
  "proxy",
  "hosting",
  "datacenter",
  "data center",
];

const PROXY_HEADERS = [
  "via",
  "x-forwarded-server",
  "x-proxy-id",
  "proxy-connection",
  "forwarded",
  "x-client-ip",
  "x-real-ip",
];

const AUTOMATED_UA_PATTERN =
  /curl|python-requests|go-http-client|node-fetch|postman|scrapy|wget|insomnia|axios|libwww|httpclient|java|urllib|aiohttp|headlesschrome|phantomjs|playwright|puppeteer/i;

export function evaluateVpnOrProxy(
  request: Request,
  info: ClientNetworkInfo,
): { isSuspicious: boolean; reason?: string } {
  if (!info.userAgent || info.userAgent.length < 8) {
    return { isSuspicious: true, reason: "missing_or_short_user_agent" };
  }
  if (AUTOMATED_UA_PATTERN.test(info.userAgent)) {
    return { isSuspicious: true, reason: "automated_user_agent" };
  }

  if (info.country === "T1" || info.country === "A1") {
    return { isSuspicious: true, reason: "tor_or_anon_proxy_country" };
  }

  if (info.threatScore !== undefined && info.threatScore >= 20) {
    return { isSuspicious: true, reason: "high_threat_score" };
  }

  for (const header of PROXY_HEADERS) {
    if (request.headers.has(header)) {
      return { isSuspicious: true, reason: `proxy_header_${header}` };
    }
  }

  const asOrgLower = info.asOrganization.toLowerCase();
  if (asOrgLower) {
    for (const keyword of SUSPICIOUS_AS_KEYWORDS) {
      if (asOrgLower.includes(keyword)) {
        return { isSuspicious: true, reason: `hosting_or_vpn_as_${keyword}` };
      }
    }
  }

  return { isSuspicious: false };
}

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin || !getRequestOrigins(request).has(origin)) {
    throw new Error("Same-origin request required");
  }
}

function firstHeader(value: string | null): string | undefined {
  return value?.split(",")[0]?.trim() || undefined;
}

/**
 * Returns the set of origins this request is legitimately served from.
 *
 * Behind an SSH reverse tunnel (or a LAN IP) Next.js normalizes `request.url`
 * to e.g. http://localhost:3000 while the browser still sends the public
 * host (e.g. http://162.43.78.145:8080) as its Origin header. We therefore
 * accept both the normalized URL origin and the origin derived from the
 * Host header so CSRF checks keep working in local/tunnel setups.
 */
export function getRequestOrigins(request: Request): Set<string> {
  const origins = new Set<string>();
  const requestUrl = new URL(request.url);
  origins.add(requestUrl.origin);

  const host =
    firstHeader(request.headers.get("x-forwarded-host")) ||
    firstHeader(request.headers.get("host"));
  if (host) {
    const proto =
      firstHeader(request.headers.get("x-forwarded-proto")) ||
      requestUrl.protocol.slice(0, -1);
    origins.add(`${proto}://${host}`);
  }
  return origins;
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
