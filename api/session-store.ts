import type { Database } from "bun:sqlite"
import type session from "express-session"
import type { Store, SessionData } from "express-session"

// A minimal persistent session store backed by bun:sqlite, replacing the
// default in-memory MemoryStore (which leaks memory, doesn't survive restarts,
// and is unsuitable for production). Sessions are stored as JSON with an
// absolute expiry derived from the cookie, and expired rows are treated as
// absent (and lazily pruned on read).
export function createSqliteSessionStore(
  sessionModule: typeof session,
  db: Database,
): Store {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      expiresAt INTEGER
    )
  `)

  const getStmt = db.query("SELECT data, expiresAt FROM sessions WHERE sid = :sid")
  const upsertStmt = db.query(`
    INSERT INTO sessions (sid, data, expiresAt) VALUES (:sid, :data, :expiresAt)
    ON CONFLICT(sid) DO UPDATE SET data = :data, expiresAt = :expiresAt
  `)
  const deleteStmt = db.query("DELETE FROM sessions WHERE sid = :sid")

  function expiryOf(sess: SessionData): number | null {
    const expires = sess.cookie?.expires
    if (expires) return new Date(expires).getTime()
    const maxAge = sess.cookie?.originalMaxAge
    if (typeof maxAge === "number") return Date.now() + maxAge
    return null
  }

  class SqliteStore extends sessionModule.Store {
    get(
      sid: string,
      callback: (_err: unknown, _session?: SessionData | null) => void,
    ): void {
      try {
        const row = getStmt.get({ sid }) as
          | { data: string; expiresAt: number | null }
          | undefined
        if (!row) {
          callback(null, null)
          return
        }
        if (row.expiresAt != null && row.expiresAt <= Date.now()) {
          deleteStmt.run({ sid })
          callback(null, null)
          return
        }
        callback(null, JSON.parse(row.data) as SessionData)
      } catch (error) {
        callback(error)
      }
    }

    set(sid: string, sess: SessionData, callback?: (_err?: unknown) => void): void {
      try {
        upsertStmt.run({
          sid,
          data: JSON.stringify(sess),
          expiresAt: expiryOf(sess),
        })
        callback?.()
      } catch (error) {
        callback?.(error)
      }
    }

    destroy(sid: string, callback?: (_err?: unknown) => void): void {
      try {
        deleteStmt.run({ sid })
        callback?.()
      } catch (error) {
        callback?.(error)
      }
    }

    touch(sid: string, sess: SessionData, callback?: (_err?: unknown) => void): void {
      // Refresh only the expiry without rewriting the whole payload.
      try {
        const expiresAt = expiryOf(sess)
        db.query("UPDATE sessions SET expiresAt = :expiresAt WHERE sid = :sid").run({
          sid,
          expiresAt,
        })
        callback?.()
      } catch (error) {
        callback?.(error)
      }
    }
  }

  return new SqliteStore()
}
