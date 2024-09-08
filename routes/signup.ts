import type { Config } from "../api/types"
import { signup } from "../api/users"
const page = "signup"

export default function (config: Config) {
  const { featureMap } = config

  return (request: Request, response) => {
    if (request.session.user) {
      delete response.locals.session
      request.session.destroy()
    }

    if (request.method !== "POST") {
      response.render(page, { page, featureMap })
      return
    }

    signup(config.database, request, (error, message) => {
      if (error) {
        console.error(error)
        response.render(page, { page, error, featureMap })
        return
      }

      response.render(page, { page, message, featureMap })
    })
  }
}
