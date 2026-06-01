import { test, expect, describe, beforeEach } from "bun:test"
import { Database } from "bun:sqlite"
import session from "express-session"
import { createSqliteSessionStore } from "./session-store"

function makeStore() {
  const db = new Database(":memory:", { strict: true })
  return { db, store: createSqliteSessionStore(session, db) }
}

function getAsync(store: session.Store, sid: string): Promise<session.SessionData | null> {
  return new Promise((resolve, reject) => {
    store.get(sid, (err: unknown, s?: session.SessionData | null) =>
      err ? reject(err) : resolve(s ?? null),
    )
  })
}

function setAsync(store: session.Store, sid: string, data: session.SessionData): Promise<void> {
  return new Promise((resolve, reject) => {
    store.set(sid, data, (err?: unknown) => (err ? reject(err) : resolve()))
  })
}

function destroyAsync(store: session.Store, sid: string): Promise<void> {
  return new Promise((resolve, reject) => {
    store.destroy(sid, (err?: unknown) => (err ? reject(err) : resolve()))
  })
}

describe("SqliteSessionStore", () => {
  let store: session.Store

  beforeEach(() => {
    store = makeStore().store
  })

  test("returns null for an unknown sid", async () => {
    expect(await getAsync(store, "missing")).toBeNull()
  })

  test("round-trips a stored session", async () => {
    const data = {
      cookie: { originalMaxAge: 1000, expires: new Date(Date.now() + 1000) },
      user: { username: "alice" },
    } as unknown as session.SessionData
    await setAsync(store, "sid1", data)
    const loaded = (await getAsync(store, "sid1")) as unknown as { user: { username: string } }
    expect(loaded.user.username).toBe("alice")
  })

  test("destroy removes a session", async () => {
    const data = { cookie: {} } as unknown as session.SessionData
    await setAsync(store, "sid2", data)
    await destroyAsync(store, "sid2")
    expect(await getAsync(store, "sid2")).toBeNull()
  })

  test("treats an expired session as absent", async () => {
    const data = {
      cookie: { expires: new Date(Date.now() - 1000) },
    } as unknown as session.SessionData
    await setAsync(store, "sid3", data)
    expect(await getAsync(store, "sid3")).toBeNull()
  })
})
