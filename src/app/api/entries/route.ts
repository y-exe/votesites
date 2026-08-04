import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchContestEntries } from "@/lib/entries";

export const runtime = "nodejs";

function getEntriesDatabase() {
  return getCloudflareContext().env.VOTES_DB;
}

export async function GET() {
  try {
    const { entries, configured } = await fetchContestEntries(getEntriesDatabase());

    return Response.json(
      { entries, configured },
      {
        headers: {
          "Cache-Control": "public, max-age=30, s-maxage=300, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return Response.json(
      { entries: [], configured: true, error: "entry_feed_unavailable" },
      {
        status: 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
