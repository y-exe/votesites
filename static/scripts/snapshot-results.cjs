const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const sourceDb = path.resolve(__dirname, "../../Vote/votes.db");
const destination = path.resolve(__dirname, "../src/data/results.json");
const database = new Database(sourceDb, { readonly: true });
const counts = new Map(
  database.prepare("SELECT video_id AS videoId, COUNT(*) AS count FROM votes WHERE is_excluded = 0 GROUP BY video_id").all().map((row) => [row.videoId, row.count]),
);
const hiddenVideoIds = new Set(
  database.prepare("SELECT video_id FROM hidden_entries").all().map((row) => row.video_id),
);
const cache = database.prepare("SELECT payload FROM entry_feed_cache WHERE id = 1").get();
if (!cache) throw new Error("entry_feed_cache is missing");
const entries = JSON.parse(cache.payload).entries.filter((entry) => !hiddenVideoIds.has(entry.youtubeId));
const ranked = entries.map((entry) => ({
  videoId: entry.youtubeId,
  count: counts.get(entry.youtubeId) || 0,
  title: entry.title || "",
  channelTitle: entry.channelTitle || "",
  channelIcon: entry.channelIcon || "",
})).sort((a, b) => b.count - a.count);
fs.writeFileSync(destination, `${JSON.stringify({ total: ranked.reduce((sum, item) => sum + item.count, 0), ranked }, null, 2)}\n`);
