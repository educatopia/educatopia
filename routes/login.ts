import type { Config, RouteRequest, RouteResponse, User } from "../api/types"
import { login } from "../api/users"
const page = "login"

export default function (config: Config) {
  const { featureMap } = config

  return (request: RouteRequest, response: RouteResponse) => {
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

      ;(request as RouteRequest & { session: { user: User } }).session.user = user!
      response.redirect(`/${user!.username}`)
    })
  }
}
