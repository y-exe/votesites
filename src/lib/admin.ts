
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
  username: string | null;
  globalName: string | null;
};

export async function getVoteRankings(database: D1Database): Promise<VoteRanking[]> {
  const result = await database
    .prepare("SELECT video_id as videoId, COUNT(*) as count FROM votes GROUP BY video_id ORDER BY count DESC LIMIT 100")
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
        v.created_at as createdAt,
        s.username,
        s.global_name as globalName
      FROM votes v
      LEFT JOIN discord_sessions s ON v.discord_user_id = s.discord_user_id
      ORDER BY v.created_at DESC
      LIMIT ?1
    `)
    .bind(limit)
    .all<RecentVote>();
  return result.results;
}
