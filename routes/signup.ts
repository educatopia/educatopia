import type { Config, RouteRequest, RouteResponse, AppRequest } from "../api/types"
import { signup } from "../api/users"
import { generateMathChallenge, verifyMathChallenge, isHoneypotFilled } from "../api/security"
const page = "signup"

export default function (config: Config) {
  const { featureMap } = config

  // Every render gets a fresh, stateless arithmetic challenge so the form always
  // carries a valid (and unexpired) token, even after an error.
  const renderWithChallenge = (
    response: RouteResponse,
    extra: Record<string, unknown> = {},
  ) => {
    const { question, token } = generateMathChallenge(config.sessionSecret)
    response.render(page, { page, featureMap, mathQuestion: question, mathToken: token, ...extra })
  }

  return (request: RouteRequest, response: RouteResponse) => {
    if ((request as RouteRequest & { session: { user?: unknown, destroy: () => void } }).session.user) {
      delete response.locals.session
      ;(request as RouteRequest & { session: { destroy: () => void } }).session.destroy()
    }

    if (request.method !== "POST") {
      renderWithChallenge(response)
      return
    }

    // A filled honeypot is a definitive bot signal; reject without the bcrypt
    // cost or DB write that signup() would incur.
    if (isHoneypotFilled(request.body.website)) {
      renderWithChallenge(response, {
        error: new Error("Sign up failed. Please try again."),
      })
      return
    }

    const { mathAnswer, mathToken } = request.body
    if (!verifyMathChallenge(config.sessionSecret, mathToken, mathAnswer)) {
      renderWithChallenge(response, {
        error: new Error("Incorrect answer to the math challenge. Please try again."),
      })
      return
    }

    signup(config.database, request as AppRequest, (error: Error | null, response_?: unknown) => {
      if (error) {
        console.error(error)
        renderWithChallenge(response, { error })
        return
      }

      const message = typeof response_ === 'string' ? response_ : 'Success'
      renderWithChallenge(response, { message })
    })
  }
}
