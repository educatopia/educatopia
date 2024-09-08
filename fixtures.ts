import { Database } from "bun:sqlite";
import bcrypt from "bcrypt";

const db = new Database("educatopia.sqlite", { strict: true });

const now = new Date().toISOString();

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    createdAt TEXT,
    updatedAt TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS exercises (
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
    note TEXT
  )
`);

// Insert test user
bcrypt.hash("test", 16, (error, hash) => {
	if (error) {
		console.error(error);
		return;
	}

	db.query(`
    INSERT OR IGNORE INTO users (username, email, password, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)`).get("test", "test@example.org", hash, now, now);

	// Insert test exercises
	const stmt = db.prepare(`
    INSERT INTO exercises
    (createdAt, updatedAt, createdBy, task, subjects, hints, approach, solutions, type, credits, difficulty, duration, tags, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

	for (let i = 0; i < 20; i++) {
		stmt.run(
			now,
			now,
			"test",
			"Finish this task and you're golden!",
			JSON.stringify(["Math", "Biology"]),
			JSON.stringify([]),
			"First you this and then that.",
			JSON.stringify(["This is the most important solution"]),
			"List",
			5,
			0.4,
			15,
			JSON.stringify(["just", "test"]),
			"A short note!",
		);
	}

	stmt.finalize();
	console.log("Fixtures have been added to the database");
	db.close();
});
