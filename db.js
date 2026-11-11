import Database from "better-sqlite3";

const db = new Database("urls.db");

db.exec(`CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
CREATE INDEX IF NOT EXISTS idx_urls_original_url ON urls (original_url);
    `);

export default db;
