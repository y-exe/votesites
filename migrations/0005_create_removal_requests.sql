CREATE TABLE IF NOT EXISTS removal_requests (
  id TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  video_ids TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  requested_ip TEXT NOT NULL,
  used_at INTEGER
);

CREATE INDEX IF NOT EXISTS removal_requests_email_created_index
  ON removal_requests (email_hash, created_at);

CREATE INDEX IF NOT EXISTS removal_requests_ip_created_index
  ON removal_requests (requested_ip, created_at);

CREATE TABLE IF NOT EXISTS removal_sessions (
  token_hash TEXT PRIMARY KEY,
  email_hash TEXT NOT NULL,
  video_ids TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);

CREATE TABLE IF NOT EXISTS removal_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id TEXT NOT NULL,
  email_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS removal_records_created_index
  ON removal_records (created_at DESC);

CREATE INDEX IF NOT EXISTS removal_records_video_id_index
  ON removal_records (video_id);
