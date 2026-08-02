import { openDatabaseSync } from "expo-sqlite";

const sqlite = openDatabaseSync("fittrack_group.db");

export function runMigrations() {
  sqlite.execSync("PRAGMA foreign_keys = ON;");

  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS workouts (
      id           TEXT PRIMARY KEY NOT NULL,
      title        TEXT NOT NULL,
      category     TEXT NOT NULL,
      duration     INTEGER NOT NULL,
      scheduled_at TEXT NOT NULL,
      completed_at TEXT,
      notes        TEXT,
      created_at   TEXT NOT NULL
    );
  `);

  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS exercises (
      id           TEXT PRIMARY KEY NOT NULL,
      workout_id   TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      name         TEXT NOT NULL,
      sets         INTEGER NOT NULL,
      reps         INTEGER NOT NULL,
      weight       INTEGER,
      duration_sec INTEGER,
      order_index  INTEGER NOT NULL
    );
  `);

  sqlite.execSync(`
    CREATE TABLE IF NOT EXISTS progress_photos (
      id           TEXT PRIMARY KEY NOT NULL,
      uri          TEXT NOT NULL,
      created_at   TEXT NOT NULL
    );
  `);

  console.log("✅ Migrations completed");
}
