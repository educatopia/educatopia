import { marked } from "marked"
import type { Exercise } from "./types"
import { sanitizeHtml } from "./security"

// Lowercase fenced code-block language tags so highlight.js
// (which keys registered languages by lowercase name) can match them.
marked.use({
  walkTokens(token) {
    if (token.type === "code" && typeof token.lang === "string") {
      token.lang = token.lang.toLowerCase()
    }
  },
})

// Render a single markdown string to sanitized HTML. `marked` performs no
// sanitization, so every rendered field MUST pass through sanitizeHtml before
// it is emitted unescaped in a view (prevents stored XSS).
function renderField(markdown: string): string {
  return sanitizeHtml(marked.parse(markdown) as string)
}

export async function renderMarkdown(exercise: Exercise): Promise<Exercise> {
  if (exercise.task) {
    exercise.task = renderField(exercise.task)
  }

  if (exercise.approach) {
    exercise.approach = renderField(exercise.approach)
  }

  if (exercise.hints) {
    exercise.hints = Array.isArray(exercise.hints)
      ? exercise.hints.map((hint) => renderField(hint))
      : exercise.hints
  }

  if (exercise.solutions) {
    exercise.solutions = Array.isArray(exercise.solutions)
      ? exercise.solutions.map((solution) => renderField(solution))
      : exercise.solutions
  }

  return exercise
}
