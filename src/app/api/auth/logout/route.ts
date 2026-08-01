import { NextResponse } from "next/server";
import { DISCORD_SESSION_COOKIE } from "@/lib/discord-auth";

export async function POST() {
  const response = NextResponse.json(
    { authenticated: false },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.delete(DISCORD_SESSION_COOKIE);
  return response;
}
