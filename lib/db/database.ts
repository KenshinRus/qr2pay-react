import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || join(process.cwd(), 'data', 'qr-codes.db');

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    // Create database connection
    db = new Database(DATABASE_PATH);

    // Enable foreign keys and WAL mode for better performance
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Initialize schema
    const schemaPath = join(process.cwd(), 'lib', 'db', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Execute schema (create tables and indexes)
    db.exec(schema);
  }

  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('exit', closeDatabase);
  process.on('SIGINT', () => {
    closeDatabase();
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    closeDatabase();
    process.exit(0);
  });
}
