CREATE TABLE votes (
  discord_user_id TEXT PRIMARY KEY
    CHECK (
      length(discord_user_id) BETWEEN 17 AND 20
      AND discord_user_id NOT GLOB '*[^0-9]*'
    ),
  video_id TEXT NOT NULL
    CHECK (
      length(video_id) = 11
      AND video_id NOT GLOB '*[^A-Za-z0-9_-]*'
    )
);

CREATE INDEX votes_video_id_index ON votes (video_id);
