// ローカルSQLiteDBに migrations/*.sql を順に適用するスクリプト
// 使い方: node scripts/dev-db.js [dbPath]
//   dbPath 省略時は votes-dev.db
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = process.argv[2] || path.join(process.cwd(), "votes-dev.db");
const migrationsDir = path.join(process.cwd(), "migrations");

if (!fs.existsSync(migrationsDir)) {
  console.error(`migrations dir not found: ${migrationsDir}`);
  process.exit(1);
}

const db = new Database(dbPath);
db.exec(
  "CREATE TABLE IF NOT EXISTS local_migrations (name TEXT PRIMARY KEY, applied_at INTEGER)",
);

const applied = new Set(
  db
    .prepare("SELECT name FROM local_migrations")
    .all()
    .map((row) => row.name),
);

const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

console.log(`Applying migrations to ${dbPath} ...`);

db.exec("BEGIN");
try {
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip (already applied) ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    db.exec(sql);
    db.prepare("INSERT INTO local_migrations (name, applied_at) VALUES (?, ?)").run(
      file,
      Date.now(),
    );
    console.log(`applied ${file}`);
  }
  db.exec("COMMIT");
  console.log("Done.");
} catch (error) {
  db.exec("ROLLBACK");
  console.error("Migration failed:", error.message);
  process.exit(1);
} finally {
  db.close();
}
