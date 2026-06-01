import { test, expect, describe } from "bun:test"
import {
  sanitizeHtml,
  sanitizeUser,
  randomUrlSafeString,
  confirmationUrl,
  canModifyExercise,
  buildSessionOptions,
  createRateLimiter,
  generateCsrfToken,
  csrfProtection,
  generateMathChallenge,
  verifyMathChallenge,
  isHoneypotFilled,
} from "./security"

describe("sanitizeHtml", () => {
  test("removes script tags", () => {
    expect(sanitizeHtml("<p>hi</p><script>alert(1)</script>")).not.toContain("script")
  })

  test("strips event handler attributes", () => {
    const out = sanitizeHtml('<img src="x" onerror="alert(1)">')
    expect(out).not.toContain("onerror")
  })

  test("strips javascript: urls", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a>')
    expect(out).not.toContain("javascript:")
  })

  test("preserves safe formatting and code", () => {
    const out = sanitizeHtml('<p><strong>bold</strong> <code class="lang-js">x</code></p>')
    expect(out).toContain("<strong>bold</strong>")
    expect(out).toContain("<code")
    expect(out).toContain("bold")
  })

  test("handles non-string input gracefully", () => {
    expect(sanitizeHtml(undefined as unknown as string)).toBe("")
  })
})

describe("sanitizeUser", () => {
  test("removes password and confirmationCode", () => {
    const out = sanitizeUser({
      username: "alice",
      email: "a@b.com",
      password: "$2b$hash",
      confirmationCode: "secret",
    })
    expect(out).toBeDefined()
    expect((out as Record<string, unknown>).password).toBeUndefined()
    expect((out as Record<string, unknown>).confirmationCode).toBeUndefined()
    expect(out?.username).toBe("alice")
    expect(out?.email).toBe("a@b.com")
  })

  test("returns undefined for nullish user", () => {
    expect(sanitizeUser(undefined)).toBeUndefined()
    expect(sanitizeUser(null)).toBeUndefined()
  })
})

describe("randomUrlSafeString", () => {
  test("contains only URL-safe characters", () => {
    for (let i = 0; i < 50; i++) {
      expect(randomUrlSafeString(33)).toMatch(/^[A-Za-z0-9_-]+$/)
    }
  })

  test("has the requested length", () => {
    expect(randomUrlSafeString(33)).toHaveLength(33)
    expect(randomUrlSafeString(10)).toHaveLength(10)
  })

  test("produces distinct values", () => {
    expect(randomUrlSafeString(33)).not.toBe(randomUrlSafeString(33))
  })
})

describe("confirmationUrl", () => {
  test("builds an https url from the trusted host", () => {
    expect(confirmationUrl("educatopia.org", "abc123")).toBe(
      "https://educatopia.org/confirm/abc123",
    )
  })

  test("uses http when not secure", () => {
    expect(confirmationUrl("localhost:3470", "abc", false)).toBe(
      "http://localhost:3470/confirm/abc",
    )
  })

  test("url-encodes the code", () => {
    expect(confirmationUrl("educatopia.org", "a/b c")).toBe(
      "https://educatopia.org/confirm/a%2Fb%20c",
    )
  })
})

describe("canModifyExercise", () => {
  test("allows the creator", () => {
    expect(
      canModifyExercise({ username: "alice" }, { createdBy: "alice" }),
    ).toBe(true)
  })

  test("denies a different user", () => {
    expect(
      canModifyExercise({ username: "bob" }, { createdBy: "alice" }),
    ).toBe(false)
  })

  test("denies when no user", () => {
    expect(canModifyExercise(undefined, { createdBy: "alice" })).toBe(false)
  })

  test("denies when exercise has no owner", () => {
    expect(canModifyExercise({ username: "alice" }, { createdBy: "" })).toBe(false)
    expect(canModifyExercise({ username: "alice" }, {})).toBe(false)
  })
})

describe("buildSessionOptions", () => {
  test("secure cookie + strict flags in production", () => {
    const opts = buildSessionOptions({ secret: "s", devMode: false })
    const cookie = opts.cookie as Record<string, unknown>
    expect(opts.resave).toBe(false)
    expect(opts.saveUninitialized).toBe(false)
    expect(cookie.httpOnly).toBe(true)
    expect(cookie.sameSite).toBe("lax")
    expect(cookie.secure).toBe(true)
    expect(cookie.maxAge as number).toBeGreaterThan(0)
  })

  test("non-secure cookie in dev so http localhost works", () => {
    const opts = buildSessionOptions({ secret: "s", devMode: true })
    const cookie = opts.cookie as Record<string, unknown>
    expect(cookie.secure).toBe(false)
  })

  test("passes through a provided store", () => {
    const store = {} as never
    expect(buildSessionOptions({ secret: "s", devMode: true, store }).store).toBe(store)
  })
})

describe("createRateLimiter", () => {
  test("allows up to max within a window then blocks", () => {
    const clock = 1000
    const limiter = createRateLimiter({ windowMs: 1000, max: 3, now: () => clock })
    expect(limiter.tryConsume("ip")).toBe(true)
    expect(limiter.tryConsume("ip")).toBe(true)
    expect(limiter.tryConsume("ip")).toBe(true)
    expect(limiter.tryConsume("ip")).toBe(false)
  })

  test("resets after the window elapses", () => {
    let clock = 1000
    const limiter = createRateLimiter({ windowMs: 1000, max: 1, now: () => clock })
    expect(limiter.tryConsume("ip")).toBe(true)
    expect(limiter.tryConsume("ip")).toBe(false)
    clock += 1001
    expect(limiter.tryConsume("ip")).toBe(true)
  })

  test("tracks keys independently", () => {
    const clock = 1000
    const limiter = createRateLimiter({ windowMs: 1000, max: 1, now: () => clock })
    expect(limiter.tryConsume("a")).toBe(true)
    expect(limiter.tryConsume("b")).toBe(true)
    expect(limiter.tryConsume("a")).toBe(false)
  })

  test("middleware sends 429 when exhausted", () => {
    const clock = 1000
    const limiter = createRateLimiter({ windowMs: 1000, max: 1, now: () => clock })
    let nextCalls = 0
    let status = 0
    const res = {
      status(code: number) {
        status = code
        return this
      },
      send() {
        return this
      },
    } as unknown as import("express").Response
    const req = { ip: "1.2.3.4" } as import("express").Request
    limiter.middleware(req, res, () => nextCalls++)
    limiter.middleware(req, res, () => nextCalls++)
    expect(nextCalls).toBe(1)
    expect(status).toBe(429)
  })
})

describe("isHoneypotFilled", () => {
  test("trips on any non-empty value", () => {
    expect(isHoneypotFilled("spam")).toBe(true)
    expect(isHoneypotFilled("  x  ")).toBe(true)
  })

  test("passes for empty, whitespace, or missing values", () => {
    expect(isHoneypotFilled("")).toBe(false)
    expect(isHoneypotFilled("   ")).toBe(false)
    expect(isHoneypotFilled(undefined)).toBe(false)
    expect(isHoneypotFilled(null)).toBe(false)
  })
})

describe("math challenge", () => {
  const secret = "test-secret"

  // Re-derive the answer from the visible "a + b" question so the test can
  // submit a correct response without depending on internals.
  function solve(question: string): number {
    const [a, b] = question.split("+").map((part) => Number(part.trim()))
    return a + b
  }

  test("accepts the correct answer", () => {
    const { question, token } = generateMathChallenge(secret)
    expect(verifyMathChallenge(secret, token, solve(question))).toBe(true)
  })

  test("accepts the answer as a string", () => {
    const { question, token } = generateMathChallenge(secret)
    expect(verifyMathChallenge(secret, token, ` ${solve(question)} `)).toBe(true)
  })

  test("rejects a wrong answer", () => {
    const { question, token } = generateMathChallenge(secret)
    expect(verifyMathChallenge(secret, token, solve(question) + 1)).toBe(false)
  })

  test("rejects a non-numeric answer", () => {
    const { token } = generateMathChallenge(secret)
    expect(verifyMathChallenge(secret, token, "abc")).toBe(false)
    expect(verifyMathChallenge(secret, token, "")).toBe(false)
    expect(verifyMathChallenge(secret, token, undefined)).toBe(false)
  })

  test("rejects a token signed with a different secret", () => {
    const { question, token } = generateMathChallenge("other-secret")
    expect(verifyMathChallenge(secret, token, solve(question))).toBe(false)
  })

  test("rejects an expired token", () => {
    let clock = 1000
    const { question, token } = generateMathChallenge(secret, () => clock)
    clock += 10 * 60 * 1000 + 1
    expect(verifyMathChallenge(secret, token, solve(question), () => clock)).toBe(false)
  })

  test("rejects a tampered expiry", () => {
    const { question, token } = generateMathChallenge(secret, () => 1000)
    const tampered = token.replace(/^\d+/, "9999999999999")
    expect(verifyMathChallenge(secret, tampered, solve(question), () => 1000)).toBe(false)
  })

  test("rejects malformed tokens", () => {
    expect(verifyMathChallenge(secret, "no-separator", 5)).toBe(false)
    expect(verifyMathChallenge(secret, 123 as unknown as string, 5)).toBe(false)
  })
})

describe("csrf", () => {
  test("generateCsrfToken returns url-safe token", () => {
    expect(generateCsrfToken()).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  function mockRes() {
    const res = {
      locals: {} as Record<string, unknown>,
      statusCode: 0,
      body: "",
      status(code: number) {
        this.statusCode = code
        return this
      },
      send(payload: string) {
        this.body = payload
        return this
      },
    }
    return res as unknown as import("express").Response & {
      locals: Record<string, unknown>
      statusCode: number
    }
  }

  test("issues a token on a GET and exposes it to views", () => {
    const session: Record<string, unknown> = {}
    const req = { method: "GET", session, body: {}, headers: {} } as unknown as import("express").Request
    const res = mockRes()
    let nexted = false
    csrfProtection(req, res, () => {
      nexted = true
    })
    expect(nexted).toBe(true)
    expect(typeof session.csrfToken).toBe("string")
    expect(res.locals.csrfToken).toBe(session.csrfToken)
  })

  test("accepts a POST with a matching token", () => {
    const session: Record<string, unknown> = { csrfToken: "tok123" }
    const req = {
      method: "POST",
      session,
      body: { _csrf: "tok123" },
      headers: {},
    } as unknown as import("express").Request
    const res = mockRes()
    let nexted = false
    csrfProtection(req, res, () => {
      nexted = true
    })
    expect(nexted).toBe(true)
    expect(res.statusCode).toBe(0)
  })

  test("rejects a POST with a missing or wrong token", () => {
    const session: Record<string, unknown> = { csrfToken: "tok123" }
    const req = {
      method: "POST",
      session,
      body: { _csrf: "wrong" },
      headers: {},
    } as unknown as import("express").Request
    const res = mockRes()
    let nexted = false
    csrfProtection(req, res, () => {
      nexted = true
    })
    expect(nexted).toBe(false)
    expect(res.statusCode).toBe(403)
  })

  test("accepts token from x-csrf-token header", () => {
    const session: Record<string, unknown> = { csrfToken: "tok123" }
    const req = {
      method: "POST",
      session,
      body: {},
      headers: { "x-csrf-token": "tok123" },
    } as unknown as import("express").Request
    const res = mockRes()
    let nexted = false
    csrfProtection(req, res, () => {
      nexted = true
    })
    expect(nexted).toBe(true)
  })
})
