CREATE TABLE IF NOT EXISTS api_rate_limit_events (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS api_rate_limit_events_lookup_index
  ON api_rate_limit_events (scope, key_hash, created_at);

CREATE INDEX IF NOT EXISTS api_rate_limit_events_expires_index
  ON api_rate_limit_events (expires_at);

CREATE TABLE IF NOT EXISTS discord_sessions (
  token_hash TEXT PRIMARY KEY,
  discord_user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  global_name TEXT,
  avatar TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS discord_sessions_expires_index
  ON discord_sessions (expires_at);

CREATE TABLE IF NOT EXISTS report_admin_credentials (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  verifier TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
