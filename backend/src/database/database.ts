import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";

const betterSqlite = new Database("DB.sqlite");
export const db = drizzle(betterSqlite, { logger: true });

migrate(db, { migrationsFolder: "./drizzle" });
