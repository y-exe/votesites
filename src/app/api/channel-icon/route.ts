import { NextRequest } from "next/server";

export const runtime = "nodejs";

const ALLOWED_HOSTS = new Set(["yt3.ggpht.com", "yt3.googleusercontent.com"]);

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("src");
  if (!source || source.length > 2_048) return new Response(null, { status: 400 });

  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)) {
    return new Response(null, { status: 400 });
  }

  try {
    const upstream = await fetch(url, {
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
      cf: { cacheTtl: 86_400, cacheEverything: true },
    });
    const contentType = upstream.headers.get("content-type") || "";
    if (!upstream.ok || !contentType.startsWith("image/")) return new Response(null, { status: 502 });
    return new Response(upstream.body, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
