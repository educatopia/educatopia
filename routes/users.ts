import type { NextFunction } from "express"
import { confirm, getUserByUsername } from "../api/users"
import { getByUser } from "../api/exercises"
import { sanitizeUser } from "../api/security"
import type { Config, RouteRequest, RouteResponse, User } from "../api/types"

// Mirrors the signup username rules; guards the catch-all /:username route so
// non-username paths fall through instead of triggering a DB lookup.
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{1,32}$/

export default function (config: Config) {
  return {
    confirm(request: RouteRequest, response: RouteResponse, next: NextFunction) {
      confirm(config.database, request.params.confirmationCode, (error: Error | null, user?: User) => {
        if (error) {
          console.error(error)
          next(error)
          return
        }

        if (!user) {
          next(new Error("User does not exist"))
          return
        }

        response.render("login", {
          page: "login",
          message:
            "You are email-address has been confirmed. " +
            "You can log in now!",
          featureMap: config.featureMap,
        })
      })
    },

    profile(request: RouteRequest, response: RouteResponse, next: NextFunction) {
      if (!USERNAME_REGEX.test(request.params.username)) {
        next()
        return
      }

      getUserByUsername(
        config.database,
        request.params.username,
        (error: Error | null, user?: User) => {
          if (error) {
            console.error(error)
            next(error)
            return
          }

          if (!user) {
            next()
            return
          }

          const exercises = getByUser(user.username);
          response.render("users/profile", {
            page: "profile",
            // Never expose the password hash / confirmation code to a view.
            user: sanitizeUser(user as unknown as Record<string, unknown>),
            exercises: exercises,
            featureMap: config.featureMap,
          })
        },
      )
    },
  }
}
