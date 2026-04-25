-- Make username and email case-insensitive for uniqueness checks.
-- SQLite cannot ALTER a column's collation, so the table is rebuilt.
-- Run inside a transaction. Aborts on conflict so duplicates can be
-- resolved manually before re-running.

BEGIN;

CREATE TABLE users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  confirmationCode TEXT,
  createdUtc now()
);

INSERT INTO users_new (id, username, password, email, confirmationCode, createdUtc)
  SELECT id, username, password, email, confirmationCode, createdUtc FROM users;

DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

COMMIT;
