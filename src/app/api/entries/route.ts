import { fetchContestEntries } from "@/lib/entries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { entries, configured } = await fetchContestEntries();

    return Response.json(
      { entries, configured },
      { headers: { "Cache-Control": "no-store" } },
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
