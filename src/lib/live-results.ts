import { getDatabase } from "@/lib/db";

export type LiveResultsState = {
  publishedCount: number;
  publishedRanks: number[];
  updatedAt: number;
};

const MAX_PUBLISHED_RANKS = 10;

async function ensureStateTable() {
  const database = getDatabase() as D1Database;
  await database.prepare(
    `CREATE TABLE IF NOT EXISTS live_results_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      published_count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL
    )`,
  ).run();
  await database.prepare(
    `INSERT OR IGNORE INTO live_results_state (id, published_count, updated_at)
     VALUES (1, 0, ?1)`,
  ).bind(Date.now()).run();
  await database.prepare(
    `CREATE TABLE IF NOT EXISTS live_results_published_ranks (
      rank INTEGER PRIMARY KEY CHECK (rank BETWEEN 1 AND 10),
      published_at INTEGER NOT NULL
    )`,
  ).run();
  return database;
}

export async function getLiveResultsState(): Promise<LiveResultsState> {
  const database = await ensureStateTable();
  const row = await database.prepare(
    "SELECT published_count, updated_at FROM live_results_state WHERE id = 1",
  ).first<{ published_count: number; updated_at: number }>();
  const ranks = await database.prepare(
    "SELECT rank FROM live_results_published_ranks ORDER BY rank",
  ).all<{ rank: number }>();
  const publishedRanks = ranks.results.map((entry) => entry.rank);
  return { publishedCount: publishedRanks.length, publishedRanks, updatedAt: row?.updated_at ?? Date.now() };
}

export async function advanceLiveResults(rank: number): Promise<LiveResultsState> {
  if (!Number.isInteger(rank) || rank < 1 || rank > MAX_PUBLISHED_RANKS) {
    throw new Error("invalid_rank");
  }
  await ensureStateTable();
  const updatedAt = Date.now();
  const database = getDatabase() as D1Database;
  await database.prepare(
    "INSERT OR IGNORE INTO live_results_published_ranks (rank, published_at) VALUES (?1, ?2)",
  ).bind(rank, updatedAt).run();
  const ranks = await database.prepare("SELECT rank FROM live_results_published_ranks ORDER BY rank").all<{ rank: number }>();
  const publishedRanks = ranks.results.map((entry) => entry.rank);
  await database.prepare(
    "UPDATE live_results_state SET published_count = ?1, updated_at = ?2 WHERE id = 1",
  ).bind(publishedRanks.length, updatedAt).run();
  return { publishedCount: publishedRanks.length, publishedRanks, updatedAt };
}

export async function resetLiveResults(): Promise<LiveResultsState> {
  await ensureStateTable();
  const updatedAt = Date.now();
  const database = getDatabase() as D1Database;
  await database.prepare("DELETE FROM live_results_published_ranks").run();
  await database.prepare("UPDATE live_results_state SET published_count = 0, updated_at = ?1 WHERE id = 1").bind(updatedAt).run();
  return { publishedCount: 0, publishedRanks: [], updatedAt };
}
