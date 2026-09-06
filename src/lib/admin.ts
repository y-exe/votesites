
export type VoteRanking = {
  videoId: string;
  count: number;
};

export type RecentVote = {
  discordUserId: string;
  videoId: string;
  ip: string;
  userAgent: string;
  country: string;
  createdAt: number;
  isExcluded: number;
  username: string | null;
  globalName: string | null;
};

export type SuspiciousVote = RecentVote & {
  matchValue: string;
};

export async function getVoteRankings(database: D1Database): Promise<VoteRanking[]> {
  const result = await database
    .prepare("SELECT video_id as videoId, COUNT(*) as count FROM votes WHERE is_excluded = 0 GROUP BY video_id ORDER BY count DESC LIMIT 100")
    .all<VoteRanking>();
  return result.results;
}

export async function getRecentVotes(database: D1Database, limit = 200): Promise<RecentVote[]> {
  const result = await database
    .prepare(`
      SELECT 
        v.discord_user_id as discordUserId,
        v.video_id as videoId,
        v.ip,
        v.user_agent as userAgent,
        v.country,
        v.updated_at as createdAt,
        v.is_excluded as isExcluded,
        s.username,
        s.global_name as globalName
      FROM votes v
      LEFT JOIN discord_sessions s ON s.token_hash = (
        SELECT latest.token_hash
        FROM discord_sessions latest
        WHERE latest.discord_user_id = v.discord_user_id
        ORDER BY latest.created_at DESC
        LIMIT 1
      )
      ORDER BY v.updated_at DESC
      LIMIT ?1
    `)
    .bind(limit)
    .all<RecentVote>();
  return result.results;
}

export async function getSuspiciousVotes(database: D1Database): Promise<SuspiciousVote[]> {
  const result = await database
    .prepare(`
      SELECT
        v.discord_user_id as discordUserId,
        v.video_id as videoId,
        v.ip,
        v.user_agent as userAgent,
        v.country,
        v.updated_at as createdAt,
        v.is_excluded as isExcluded,
        s.username,
        s.global_name as globalName,
        v.ip as matchValue
      FROM votes v
      LEFT JOIN discord_sessions s ON s.token_hash = (
        SELECT latest.token_hash
        FROM discord_sessions latest
        WHERE latest.discord_user_id = v.discord_user_id
        ORDER BY latest.created_at DESC
        LIMIT 1
      )
      WHERE v.ip <> ''
        AND EXISTS (
          SELECT 1
          FROM votes paired
          WHERE paired.video_id = v.video_id
            AND paired.ip = v.ip
            AND paired.ip <> ''
            AND paired.discord_user_id <> v.discord_user_id
        )
      ORDER BY videoId, matchValue, createdAt DESC
    `)
    .all<SuspiciousVote>();
  return result.results;
}
