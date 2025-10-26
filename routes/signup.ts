import type { Config, RouteRequest, RouteResponse, AppRequest } from "../api/types"
import { signup } from "../api/users"
const page = "signup"

export default function (config: Config) {
  const { featureMap } = config

  return (request: RouteRequest, response: RouteResponse) => {
    if ((request as RouteRequest & { session: { user?: unknown, destroy: () => void } }).session.user) {
      delete response.locals.session
      ;(request as RouteRequest & { session: { destroy: () => void } }).session.destroy()
    }

    if (request.method !== "POST") {
      response.render(page, { page, featureMap })
      return
    }

    signup(config.database, request as AppRequest, (error: Error | null, response_?: unknown) => {
      if (error) {
        console.error(error)
        response.render(page, { page, error, featureMap })
        return
      }

      const message = typeof response_ === 'string' ? response_ : 'Success'
      response.render(page, { page, message, featureMap })
    })
  }
}
