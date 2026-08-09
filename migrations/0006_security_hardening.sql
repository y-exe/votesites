CREATE TABLE IF NOT EXISTS api_rate_limits (
  scope TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at INTEGER NOT NULL,
  PRIMARY KEY (scope, key_hash, bucket)
);

CREATE INDEX IF NOT EXISTS api_rate_limits_expires_index
  ON api_rate_limits (expires_at);

CREATE TABLE IF NOT EXISTS report_admin_sessions (
  token_hash TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS report_admin_sessions_expires_index
  ON report_admin_sessions (expires_at);

UPDATE reports
SET ip = lower(hex(randomblob(32)))
WHERE length(ip) != 64 OR ip GLOB '*[^0-9a-fA-F]*';
