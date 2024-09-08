import { confirm, getUserByUsername } from "../api/users"
import { getByUser } from "../api/exercises"
import type { Config } from "../api/types"

export default function (config: Config) {
  return {
    confirm(request, response, next) {
      confirm(request.params.confirmationCode, (error, user) => {
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

    profile(request, response, next) {
      getUserByUsername(
        config.database,
        request.params.username,
        (error, user) => {
          if (error) {
            console.error(error)
            return
          }

          if (!user) {
            next()
            return
          }

          getByUser(request.params.username, (loadError, exercises) => {
            if (loadError) {
              console.error(loadError)
              return
            }

            response.render("users/profile", {
              page: "profile",
              user: user,
              exercises: exercises,
              featureMap: config.featureMap,
            })
          })
        },
      )
    },
  }
}
