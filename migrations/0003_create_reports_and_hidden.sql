CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS reports_video_id_index ON reports (video_id);

CREATE TABLE IF NOT EXISTS hidden_entries (
  video_id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL
);
