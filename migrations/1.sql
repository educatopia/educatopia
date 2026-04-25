-- Make username and email case-insensitive for uniqueness checks,
-- and align the schema with the application code (add name, replace
-- createdUtc with createdAt, add updatedAt).
-- SQLite cannot ALTER a column's collation, so the table is rebuilt.
-- Run inside a transaction. Aborts on conflict so duplicates can be
-- resolved manually before re-running.

BEGIN;

CREATE TABLE users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  confirmationCode TEXT,
  createdAt TEXT,
  updatedAt TEXT
);

INSERT INTO users_new (id, username, password, email, confirmationCode, createdAt)
  SELECT id, username, password, email, confirmationCode, createdUtc FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

COMMIT;
