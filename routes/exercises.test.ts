import { test, expect, describe, beforeEach } from "bun:test"
import { update, edit, _setTestHooks } from "./exercises"
import type { ApiModules, Config, RouteRequest, RouteResponse } from "../api/types"

// A fake exercises api so these tests never touch the production database.
function makeApi(overrides: Partial<ApiModules["exercises"]> = {}): {
  api: ApiModules["exercises"]
  state: { updateCalls: number }
} {
  const state = { updateCalls: 0 }
  const api = {
    getById: (() => ({ id: "1", slug: "s", createdBy: "alice" })) as never,
    getBySlug: (() => ({ id: "1", slug: "s", createdBy: "alice" })) as never,
    getByIdRendered: (async () => null) as never,
    getBySlugRendered: (async () => null) as never,
    getHistoryById: (() => []) as never,
    getAll: (() => []) as never,
    getAllSubjects: (() => []) as never,
    getAllTags: (() => []) as never,
    add: (() => undefined) as never,
    update: ((..._args: unknown[]) => {
      state.updateCalls++
    }) as never,
    deleteExercise: (() => undefined) as never,
    ...overrides,
  } as ApiModules["exercises"]
  return { api, state }
}

const config = { featureMap: { exercises: true } } as unknown as Config

function makeRes() {
  const res = {
    statusCode: 0,
    redirectedTo: "",
    rendered: "",
    status(code: number) {
      this.statusCode = code
      return this
    },
    redirect(url: string) {
      this.redirectedTo = url
      return this
    },
    render(view: string) {
      this.rendered = view
      return this
    },
  }
  return res as unknown as RouteResponse & {
    statusCode: number
    redirectedTo: string
    rendered: string
  }
}

describe("exercise update authorization (C1)", () => {
  beforeEach(() => {
    const { api } = makeApi()
    _setTestHooks(api, config)
  })

  test("redirects to /login when unauthenticated", () => {
    const { api } = makeApi()
    _setTestHooks(api, config)
    const req = { body: { id: "1" }, session: {} } as unknown as RouteRequest
    const res = makeRes()
    update(req, res, () => {})
    expect(res.redirectedTo).toBe("/login")
  })

  test("returns 403 when a non-owner tries to update", () => {
    const fake = makeApi({
      getById: (() => ({ id: "1", createdBy: "alice" })) as never,
    })
    _setTestHooks(fake.api, config)
    const req = {
      body: { id: "1" },
      session: { user: { username: "mallory" } },
    } as unknown as RouteRequest
    const res = makeRes()
    update(req, res, () => {})
    expect(res.statusCode).toBe(403)
    expect(fake.state.updateCalls).toBe(0)
  })

  test("calls next() when the exercise does not exist", () => {
    const fake = makeApi({ getById: (() => null) as never })
    _setTestHooks(fake.api, config)
    const req = {
      body: { id: "999" },
      session: { user: { username: "alice" } },
    } as unknown as RouteRequest
    const res = makeRes()
    let nexted = false
    update(req, res, () => {
      nexted = true
    })
    expect(nexted).toBe(true)
    expect(fake.state.updateCalls).toBe(0)
  })

  test("allows the owner to update", () => {
    const fake = makeApi({
      getById: (() => ({ id: "1", slug: "s", createdBy: "alice" })) as never,
    })
    _setTestHooks(fake.api, config)
    const req = {
      body: { id: "1", subjects: "math", tags: "algebra" },
      session: { user: { username: "alice" } },
    } as unknown as RouteRequest
    const res = makeRes()
    update(req, res, () => {})
    expect(fake.state.updateCalls).toBe(1)
    // POST-redirect-GET: redirect to the canonical exercise URL so the view is
    // re-rendered with the slug intact (avoids `/exercises/undefined/...` links).
    expect(res.redirectedTo).toBe("/exercises/s")
  })
})

describe("exercise edit authorization (C1)", () => {
  test("redirects to /login when unauthenticated", () => {
    const { api } = makeApi()
    _setTestHooks(api, config)
    const req = {
      method: "GET",
      params: { id: "s" },
      session: {},
    } as unknown as RouteRequest
    const res = makeRes()
    edit(req, res, () => {})
    expect(res.redirectedTo).toBe("/login")
  })

  test("returns 403 when a non-owner opens the edit form", () => {
    const fake = makeApi({
      getBySlug: (() => ({ id: "1", slug: "s", createdBy: "alice" })) as never,
    })
    _setTestHooks(fake.api, config)
    const req = {
      method: "GET",
      params: { id: "s" },
      session: { user: { username: "mallory" } },
    } as unknown as RouteRequest
    const res = makeRes()
    edit(req, res, () => {})
    expect(res.statusCode).toBe(403)
  })
})
