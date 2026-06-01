import { test, expect, describe } from "bun:test"
import { renderMarkdown } from "./markdown"
import type { Exercise } from "./types"

function exercise(fields: Partial<Exercise>): Exercise {
  return {
    id: "1",
    slug: "s",
    subjects: [],
    hints: [],
    solutions: [],
    tags: [],
    task: "",
    approach: "",
    ...fields,
  } as Exercise
}

describe("renderMarkdown", () => {
  test("strips <script> from the task", async () => {
    const out = await renderMarkdown(exercise({ task: "hi <script>alert(1)</script>" }))
    expect(out.task).not.toContain("<script")
    expect(out.task).toContain("hi")
  })

  test("strips event-handler attributes injected via raw HTML", async () => {
    const out = await renderMarkdown(
      exercise({ task: '<img src="x" onerror="alert(1)">' }),
    )
    expect(out.task).not.toContain("onerror")
  })

  test("sanitizes hints and solutions arrays", async () => {
    const out = await renderMarkdown(
      exercise({
        hints: ["<script>alert(1)</script>ok"],
        solutions: ['<a href="javascript:alert(1)">x</a>'],
      }),
    )
    expect((out.hints as string[])[0]).not.toContain("<script")
    expect((out.solutions as string[])[0]).not.toContain("javascript:")
  })

  test("preserves safe markdown formatting", async () => {
    const out = await renderMarkdown(exercise({ task: "**bold** and `code`" }))
    expect(out.task).toContain("<strong>bold</strong>")
    expect(out.task).toContain("<code>code</code>")
  })
})
