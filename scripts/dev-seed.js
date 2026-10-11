const Database = require("better-sqlite3");

const db = new Database("votes-dev.db");

const cacheRow = db.prepare("SELECT payload FROM entry_feed_cache WHERE id = 1").get();
let entries = [];
if (cacheRow) {
  try {
    const parsed = JSON.parse(cacheRow.payload);
    entries = Array.isArray(parsed.entries) ? parsed.entries : [];
  } catch (error) {
    console.error("Failed to parse entry_feed_cache:", error.message);
  }
}
if (entries.length === 0) {
  console.error(
    "entry_feed_cache が空です。先に dev サーバーで /api/entries にアクセスしてから再実行してください。",
  );
  process.exit(1);
}

db.prepare("DELETE FROM votes").run();

const totalTarget = 200;
const counts = [];
let remaining = totalTarget;
for (let i = 0; i < entries.length && remaining > 0; i++) {
  const remainingEntries = entries.length - i;
  const share = Math.max(1, Math.ceil((remaining * 2) / (remainingEntries + 1)));
  const count = Math.min(share, remaining);
  counts.push(count);
  remaining -= count;
}

const now = Date.now();
const insert = db.prepare(`
  INSERT INTO votes (
    discord_user_id, video_id, ip, user_agent, country,
    as_organization, asn, is_suspicious, suspicious_reason, threat_score,
    created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, '', NULL, ?, ?)
`);

let total = 0;
let idCounter = 0;
entries.forEach((entry, index) => {
  const videoId = entry.youtubeId;
  const count = counts[index] || 0;
  for (let k = 0; k < count; k++) {
    const discordUserId = (10000000000000000n + BigInt(idCounter)).toString();
    idCounter += 1;
    insert.run(
      discordUserId,
      videoId,
      "dev-seed",
      "dev-seed",
      "JP",
      "dev-seed",
      null,
      now - idCounter * 1000,
      now,
    );
    total += 1;
  }
});

console.log(
  `Seeded ${total} votes across ${entries.length} entries into votes-dev.db`,
);
