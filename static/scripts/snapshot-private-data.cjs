const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const sourceRoot = path.resolve(__dirname, "../../Vote");
const staticRoot = path.resolve(__dirname, "..");
const sourceDb = path.join(sourceRoot, "votes.db");
const csvSource = path.resolve("C:/Users/yexe/Downloads/やまかわてるき投票サイト用スプレッドシート（編集厳禁）.csv");
const privateDirectory = path.join(staticRoot, "private-data");
const publicDirectory = path.join(staticRoot, "src/data");

fs.mkdirSync(privateDirectory, { recursive: true });
fs.mkdirSync(publicDirectory, { recursive: true });

const database = new Database(sourceDb, { readonly: true });
const tables = database
  .prepare("SELECT name FROM sqlite_master WHERE type = ? AND name NOT LIKE ? ORDER BY name")
  .all("table", "sqlite_%")
  .map((row) => row.name);
const quoteIdentifier = (name) => `\"${name.replaceAll("\"", "\"\"")}\"`;
const tablesSnapshot = Object.fromEntries(
  tables.map((table) => [table, database.prepare(`SELECT * FROM ${quoteIdentifier(table)}`).all()]),
);

const privateSnapshot = {
  generatedAt: new Date().toISOString(),
  source: "C:/Code/Vote/votes.db",
  tables: tablesSnapshot,
};
fs.writeFileSync(path.join(privateDirectory, "d1-full.json"), `${JSON.stringify(privateSnapshot, null, 2)}\n`);

if (fs.existsSync(csvSource)) {
  fs.copyFileSync(csvSource, path.join(privateDirectory, "entries-original.csv"));
}

const cached = database.prepare("SELECT payload FROM entry_feed_cache WHERE id = 1").get();
if (cached) {
  const hiddenVideoIds = new Set(
    database.prepare("SELECT video_id FROM hidden_entries").all().map((row) => row.video_id),
  );
  const entries = (JSON.parse(cached.payload).entries || [])
    .filter((entry) => !hiddenVideoIds.has(entry.youtubeId));
  const publicEntries = entries.map((entry) => ({
    videoId: entry.youtubeId || "",
    title: entry.title || "",
    channelTitle: entry.channelTitle || "",
    channelIcon: entry.channelIcon || "",
  }));
  fs.writeFileSync(path.join(publicDirectory, "entries.json"), `${JSON.stringify(publicEntries, null, 2)}\n`);
}

console.log(`Saved ${tables.length} D1 tables to private-data and a sanitized public entries snapshot.`);
