-- Keep every vote record for auditing, while allowing an administrator to
-- exclude an individual vote from public totals.
ALTER TABLE votes ADD COLUMN is_excluded INTEGER NOT NULL DEFAULT 0 CHECK (is_excluded IN (0, 1));
ALTER TABLE votes ADD COLUMN excluded_at INTEGER;

CREATE INDEX IF NOT EXISTS votes_excluded_video_index ON votes (is_excluded, video_id);
