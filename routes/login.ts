import type { NextFunction } from "express"
import type { Config, RouteRequest, RouteResponse, User } from "../api/types"
import { login } from "../api/users"
import { sanitizeUser } from "../api/security"
const page = "login"

type SessionWithRegenerate = {
  user?: unknown
  regenerate: (_callback: (_err?: unknown) => void) => void
}

export default function (config: Config) {
  const { featureMap } = config

  return (request: RouteRequest, response: RouteResponse, next: NextFunction) => {
    if (request.method !== "POST") {
      response.render(page, { page, featureMap })
      return
    }

    login(config.database, request.body.username as string, request.body.password as string, (error: Error | null, user?: User) => {
      if (error) {
        console.error(`Following error occurred during login: ${error.message}`)
        response.render(page, { page, error, featureMap })
        return
      }

      // Regenerate the session id on login to prevent session fixation, then
      // store only non-sensitive user fields (never the password hash).
      const session = (request as RouteRequest & { session: SessionWithRegenerate }).session
      session.regenerate((regenerateError) => {
        if (regenerateError) {
          next(regenerateError)
          return
        }
        ;(request.session as unknown as { user?: unknown }).user =
          sanitizeUser(user as unknown as Record<string, unknown>)
        response.redirect(`/${user!.username}`)
      })
    })
  }
}
