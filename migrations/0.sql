-- Types are described in https://github.com/Airsequel/SQLite-Extra-Types

-- Users table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  confirmationCode TEXT,
  createdUtc now()
);

-- Exercises table (final schema including slug)
CREATE TABLE exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT,
  updatedAt TEXT,
  createdBy TEXT,
  task TEXT,
  subjects TEXT,
  hints TEXT,
  approach TEXT,
  solutions TEXT,
  type TEXT,
  credits INTEGER,
  difficulty REAL,
  duration INTEGER,
  tags TEXT,
  note TEXT,
  language TEXT,
  slug TEXT NOT NULL UNIQUE
);

-- Exercise history table
CREATE TABLE exercise_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exerciseId INTEGER NOT NULL,
  task TEXT NOT NULL,
  approach TEXT,
  solutions TEXT,
  subjects TEXT NOT NULL,
  type TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  difficulty REAL NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0,
  tags TEXT,
  note TEXT,
  hints TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  createdBy TEXT NOT NULL,
  FOREIGN KEY (exerciseId) REFERENCES exercises(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_exercise_history_exerciseId ON exercise_history(exerciseId);
CREATE INDEX idx_exercise_history_updatedAt ON exercise_history(updatedAt);
