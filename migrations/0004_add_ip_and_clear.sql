DELETE FROM reports;
DELETE FROM hidden_entries;

ALTER TABLE reports ADD COLUMN ip TEXT NOT NULL DEFAULT '';
CREATE UNIQUE INDEX IF NOT EXISTS reports_video_ip_unique ON reports (video_id, ip);
