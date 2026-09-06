import Database from 'better-sqlite3';
import path from 'path';

export interface D1Result<T = unknown> {
  results: T[];
  success: true;
  meta: any;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}

let dbInstance: D1Database | null = null;

export function getDatabase(): any {
  if (!dbInstance) {
    const dbPath = process.env.VOTES_DB_PATH || path.join(process.cwd(), 'votes.db');
    const db = new Database(dbPath);
    dbInstance = {
      prepare: (query: string) => {
        const stmt = db.prepare(query);
        const createStatement = (boundArgs: any[]): D1PreparedStatement => ({
          bind: (...args: any[]) => createStatement(args),
          first: async <T = unknown>() => {
             let row;
             if (boundArgs.length > 0) {
               const params: Record<string, any> = {};
               boundArgs.forEach((val, i) => { params[(i + 1).toString()] = val; });
               row = stmt.get(params) as any;
             } else {
               row = stmt.get() as any;
             }
             return row ? row as T : null;
          },
          all: async <T = unknown>() => {
             let results;
             if (boundArgs.length > 0) {
               const params: Record<string, any> = {};
               boundArgs.forEach((val, i) => { params[(i + 1).toString()] = val; });
               results = stmt.all(params) as T[];
             } else {
               results = stmt.all() as T[];
             }
             return { results, success: true, meta: {} };
          },
          run: async <T = unknown>() => {
             let info;
             if (boundArgs.length > 0) {
               const params: Record<string, any> = {};
               boundArgs.forEach((val, i) => { params[(i + 1).toString()] = val; });
               info = stmt.run(params);
             } else {
               info = stmt.run();
             }
             return { results: [], success: true, meta: { changes: info.changes } };
          }
        });
        return createStatement([]);
      },
      batch: async (statements: D1PreparedStatement[]) => {
        const results: D1Result[] = [];
        for (const statement of statements) {
          results.push(await statement.run());
        }
        return results;
      }
    };
  }
  return dbInstance;
}
