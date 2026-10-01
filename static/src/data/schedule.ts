export type VotingPhase = "before" | "open" | "closed";

// 2026年8月29日 20:00 ～ 9月4日 23:59（日本時間）
export const VOTING_START_AT = Date.UTC(2026, 7, 29, 11, 0, 0);
export const VOTING_END_AT = Date.UTC(2026, 8, 4, 15, 0, 0);

// 2026年9月5日 21:00（日本時間）
export const RESULTS_PUBLISH_AT = Date.UTC(2026, 8, 5, 12, 0, 0);

export function getVotingPhase(now = Date.now()): VotingPhase {
  if (now < VOTING_START_AT) return "before";
  if (now >= VOTING_END_AT) return "closed";
  return "open";
}
