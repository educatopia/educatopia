# Agents

This file provides guidance to coding agents when working with code in this repository.


## Commands

- `make test` — type-check + ESLint + Bun tests. **Run after every change.**
- `make type-check` / `make lint` / `make format` —
    individual checks (`format` runs `eslint --fix`).
- `make start` — start the dev server on `http://localhost:3470` via `bun run server.ts`.
- Single test file: `bun test api/exercises.test.ts`
- Single test by name: `bun test --test-name-pattern "rejects duplicate username"`
- See `make help` for Docker/deploy targets.


## Architecture

Bun + TypeScript + Express server rendering Pug views, backed by SQLite via `bun:sqlite`.
Production DB file: `educatopia.sqlite`.
Schema lives in `migrations/0.sql`.

**Two-layer separation, both keyed by domain (`exercises`, `lessons`, `courses`, `users`):**
- `api/<domain>.ts` — data access.
    Opens its own `Database` handle directly to `educatopia.sqlite`
    (no shared connection / DI).
    Returns plain objects.
- `routes/<domain>.ts` — HTTP handlers.
    Each module exports a factory `(conf) => handlers`
    that's called once in `server.ts` and wired into Express routes.
    Handlers import the corresponding `api/` module for data access.

**Config flow:** `server.ts` builds a single `conf` object
(port, db handle, `featureMap`, `featuredExercises`, `knowledgeBasePath`)
and passes it to each route factory.
`featureMap` gates `courses`/`lessons`/`exercises` route registration —
`courses` and `lessons` are currently off.

**Static content:** course/lesson markdown lives in the `knowledge_base` npm package,
served from `node_modules/knowledge_base/`.
`/modules` exposes `node_modules` as static assets so client-side JS can pull
from installed packages (e.g., MathJax, Bootstrap, jQuery).

**Tests** use `bun:test` and never touch the production DB.
Two patterns in use:
- `api/users.test.ts` — imports the real module and points it
    at an in-memory SQLite created in `beforeEach`.
- `api/exercises.test.ts` — reimplements the functions against a separate
    `test-exercises.sqlite` file (the production module isn't imported).
    When changing `api/exercises.ts`, the test's local copy must be updated
    in parallel or the test will silently drift from production behavior.

**Sessions** use `express-session` with `SESSION_SECRET` (asserted in non-dev mode).
`request.session` is exposed to all views via `response.locals.session`.


## Conventions

- Source code is licensed AGPL-3.0-or-later (see `license.txt`).
- ESLint enforces `--max-warnings 0`; lint failures break `make test`.
- Use `bun:sqlite` (not the `sqlite3` npm package)
    for new DB code — the latter is a legacy dependency.
