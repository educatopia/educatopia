import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { test, expect } from "bun:test"
import { Database } from "bun:sqlite"

import { migrate } from "./migrate"

const silent = () => {}

function columnNames(database: Database, table: string): string[] {
  return (database.query(`PRAGMA table_info(${table})`).all() as { name: string }[]).map(
    (column) => column.name,
  )
}

test("applies all migrations to a fresh database", () => {
  const database = new Database(":memory:")

  const version = migrate(database, { log: silent })

  expect(version).toBe(3)
  expect((database.query("PRAGMA user_version").get() as { user_version: number }).user_version).toBe(3)
  expect(columnNames(database, "users")).toContain("confirmationCodeCreatedAt")
})

test("is a no-op when already up to date", () => {
  const database = new Database(":memory:")
  migrate(database, { log: silent })

  // A second run must not attempt to re-create tables or re-add columns.
  expect(() => migrate(database, { log: silent })).not.toThrow()
  expect((database.query("PRAGMA user_version").get() as { user_version: number }).user_version).toBe(3)
})

test("resumes from a partially migrated database", () => {
  const database = new Database(":memory:")
  // Pretend migration 0 was already applied by hand.
  database.exec(fs.readFileSync(path.join(import.meta.dir, "migrations/0.sql"), "utf8"))
  database.exec("PRAGMA user_version = 1")

  // The original `users` table from 0.sql lacks the column 2.sql adds.
  expect(columnNames(database, "users")).not.toContain("confirmationCodeCreatedAt")

  const version = migrate(database, { log: silent })

  expect(version).toBe(3)
  expect(columnNames(database, "users")).toContain("confirmationCodeCreatedAt")
})

test("rejects non-contiguous migration numbering", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "migrations-"))
  fs.writeFileSync(path.join(dir, "0.sql"), "CREATE TABLE a(x);")
  fs.writeFileSync(path.join(dir, "2.sql"), "CREATE TABLE b(y);")

  const database = new Database(":memory:")
  expect(() => migrate(database, { dir, log: silent })).toThrow(/contiguously/)
})
