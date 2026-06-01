import { test, expect, describe } from "bun:test"
import { Database } from "bun:sqlite"
import bcrypt from "bcrypt"
import loginFactory from "./login"
import type { Config, RouteRequest, RouteResponse } from "../api/types"

function makeDbWithUser(opts: { confirmed: boolean }) {
  const db = new Database(":memory:", { strict: true })
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      name TEXT,
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      confirmationCode TEXT,
      confirmationCodeCreatedAt TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `)
  db.query(
    "INSERT INTO users (username, password, email, confirmationCode) VALUES (?, ?, ?, ?)",
  ).run(
    "alice",
    bcrypt.hashSync("password123", 4),
    "alice@example.com",
    opts.confirmed ? null : "code123",
  )
  return db
}

function makeReqRes(body: Record<string, unknown>) {
  let regenerated = false
  const session: Record<string, unknown> = {
    user: { stale: true },
    regenerate(cb: (_err?: unknown) => void) {
      regenerated = true
      // Simulate express-session: wipe the session contents.
      delete session.user
      cb()
    },
  }
  const req = { method: "POST", body, session } as unknown as RouteRequest
  const res = {
    redirectedTo: "",
    renderedWith: null as Record<string, unknown> | null,
    redirect(url: string) {
      this.redirectedTo = url
    },
    render(_view: string, locals?: Record<string, unknown>) {
      this.renderedWith = locals ?? {}
    },
  }
  return {
    req,
    res: res as unknown as RouteResponse & {
      redirectedTo: string
      renderedWith: Record<string, unknown> | null
    },
    session,
    wasRegenerated: () => regenerated,
  }
}

describe("login route (H1 + M3)", () => {
  test("regenerates the session and stores a password-free user on success", async () => {
    const config = {
      database: makeDbWithUser({ confirmed: true }),
      featureMap: {},
    } as unknown as Config
    const handler = loginFactory(config)
    const { req, res, session, wasRegenerated } = makeReqRes({
      username: "alice",
      password: "password123",
    })

    await new Promise<void>((resolve) => {
      const origRedirect = res.redirect.bind(res)
      ;(res as unknown as { redirect: (_u: string) => void }).redirect = (u: string) => {
        origRedirect(u)
        resolve()
      }
      handler(req, res, () => resolve())
    })

    expect(wasRegenerated()).toBe(true)
    expect(res.redirectedTo).toBe("/alice")
    const stored = session.user as Record<string, unknown>
    expect(stored.username).toBe("alice")
    expect(stored.password).toBeUndefined()
    expect(stored.confirmationCode).toBeUndefined()
  })

  test("does not regenerate or set a user on bad credentials", async () => {
    const config = {
      database: makeDbWithUser({ confirmed: true }),
      featureMap: {},
    } as unknown as Config
    const handler = loginFactory(config)
    const { req, res, wasRegenerated } = makeReqRes({
      username: "alice",
      password: "wrong",
    })

    await new Promise<void>((resolve) => {
      ;(res as unknown as { render: (_v: string, _l?: object) => void }).render = () => resolve()
      handler(req, res, () => resolve())
    })

    expect(wasRegenerated()).toBe(false)
    expect(res.redirectedTo).toBe("")
  })
})
