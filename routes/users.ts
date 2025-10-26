import type { NextFunction } from "express"
import { confirm, getUserByUsername } from "../api/users"
import { getByUser } from "../api/exercises"
import type { Config, RouteRequest, RouteResponse, User } from "../api/types"

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
      getUserByUsername(
        config.database,
        request.params.username,
        (error: Error | null, user?: User) => {
          if (error) {
            console.error(error)
            return
          }

          if (!user) {
            next()
            return
          }

          const exercises = getByUser(user.username);
          response.render("users/profile", {
            page: "profile",
            user: user,
            exercises: exercises,
            featureMap: config.featureMap,
          })
        },
      )
    },
  }
}
