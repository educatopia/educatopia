import crypto from "node:crypto"
import sanitizeHtmlLib from "sanitize-html"
import session from "express-session"
import type { Request, Response, NextFunction, RequestHandler } from "express"

// Allowlist-based HTML sanitizer for markdown-rendered, user-supplied content.
// `marked` performs no sanitization, so its output must be scrubbed before it
// is emitted unescaped in the views (see views/exercises/view.pug).
const ALLOWED_TAGS = [
  "p", "br", "hr", "span", "div",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "em", "b", "i", "u", "s", "del", "ins", "mark", "sub", "sup",
  "blockquote", "code", "pre", "kbd", "samp",
  "ul", "ol", "li",
  "a", "img",
  "table", "thead", "tbody", "tfoot", "tr", "th", "td", "caption",
]

export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== "string") return ""
  return sanitizeHtmlLib(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title"],
      img: ["src", "alt", "title"],
      // Class is needed for highlight.js / markdown code styling.
      "*": ["class"],
    },
    // Only safe URL schemes; this drops `javascript:` and friends.
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] },
    disallowedTagsMode: "discard",
  })
}

// Strip secret/sensitive fields before a user object enters a session or a view.
export function sanitizeUser<T extends Record<string, unknown>>(
  user: T | null | undefined,
): Omit<T, "password" | "confirmationCode"> | undefined {
  if (!user) return undefined
  const { password: _password, confirmationCode: _confirmationCode, ...safe } = user
  return safe
}

// URL-safe random string. Uses base64url and a *global* replace so codes never
// contain `+` or `/` (which would corrupt a `/confirm/:code` URL).
export function randomUrlSafeString(length: number): string {
  return crypto
    .randomBytes(length * 2)
    .toString("base64")
    .replace(/[+/=]/g, "")
    .slice(0, length)
}

// Build a confirmation link from a TRUSTED host (server config), never from
// the client-controlled Host header, to avoid host-header injection.
export function confirmationUrl(host: string, code: string, secure = true): string {
  const protocol = secure ? "https" : "http"
  return `${protocol}://${host}/confirm/${encodeURIComponent(code)}`
}

// Ownership check for exercise mutation. No roles exist, so the creator is the
// only principal allowed to modify an exercise.
export function canModifyExercise(
  user: { username?: string } | null | undefined,
  exercise: { createdBy?: string } | null | undefined,
): boolean {
  if (!user || !user.username) return false
  if (!exercise || !exercise.createdBy) return false
  return exercise.createdBy === user.username
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function buildSessionOptions(opts: {
  secret: string
  devMode: boolean
  store?: session.Store
}): session.SessionOptions {
  return {
    secret: opts.secret,
    resave: false,
    saveUninitialized: false,
    store: opts.store,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      // Secure cookies require HTTPS; disable only for local http dev.
      secure: !opts.devMode,
      maxAge: ONE_WEEK_MS,
    },
  }
}

type RateLimiterOptions = {
  windowMs: number
  max: number
  now?: () => number
}

// Fixed-window in-memory rate limiter. `now` is injectable for deterministic
// tests. Keyed by caller-provided string (typically the client IP).
export function createRateLimiter(options: RateLimiterOptions): {
  tryConsume: (_key: string) => boolean
  middleware: RequestHandler
} {
  const { windowMs, max } = options
  const now = options.now ?? (() => Date.now())
  const hits = new Map<string, { count: number; resetAt: number }>()

  function tryConsume(key: string): boolean {
    const current = now()
    const entry = hits.get(key)
    if (!entry || current >= entry.resetAt) {
      hits.set(key, { count: 1, resetAt: current + windowMs })
      return true
    }
    if (entry.count >= max) return false
    entry.count++
    return true
  }

  const middleware: RequestHandler = (request, response, next) => {
    const key = request.ip || "unknown"
    if (tryConsume(key)) {
      next()
      return
    }
    response.status(429).send("Too many requests. Please try again later.")
  }

  return { tryConsume, middleware }
}

export function generateCsrfToken(): string {
  return randomUrlSafeString(32)
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

// Synchronizer-token CSRF protection. A per-session token is issued and exposed
// to views as `csrfToken`; state-changing requests must echo it back via the
// `_csrf` body field or the `x-csrf-token` header.
export function csrfProtection(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const session = (request as Request & { session?: Record<string, unknown> }).session

  if (!session) {
    // No session middleware ran; cannot protect this request.
    next()
    return
  }

  if (typeof session.csrfToken !== "string") {
    session.csrfToken = generateCsrfToken()
  }

  response.locals.csrfToken = session.csrfToken

  if (SAFE_METHODS.has(request.method)) {
    next()
    return
  }

  const body = (request.body ?? {}) as Record<string, unknown>
  const headerToken = request.headers["x-csrf-token"]
  const provided =
    (typeof body._csrf === "string" ? body._csrf : undefined) ??
    (typeof headerToken === "string" ? headerToken : undefined)

  if (provided && provided === session.csrfToken) {
    next()
    return
  }

  response.status(403).send("Invalid or missing CSRF token.")
}
