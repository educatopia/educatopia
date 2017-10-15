const usersApi = require('../api/users')
const exercisesApi = require('../api/exercises')


module.exports = config => {
  const {getByUser} = exercisesApi(config)
  const {confirm: apiConfirm, getByUsername} = usersApi(config)

  return {
    confirm (request, response, next) {
      apiConfirm(
        request.params.confirmationCode,
        (error, user) => {
          if (error) {
            console.error(error)
            next(error)
            return
          }

          if (!user) {
            next(new Error('User does not exist'))
            return
          }

          response.render('login', {
            page: 'login',
            message: 'You are email-address has been confirmed. ' +
              'You can log in now!',
            featureMap: config.featureMap,
          })
        }
      )
    },

    profile (request, response, next) {
      getByUsername(
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

          getByUser(
            request.params.username,
            (loadError, exercises) => {
              if (loadError) {
                console.error(loadError)
                return
              }

              response.render('users/profile', {
                page: 'profile',
                user: user,
                exercises: exercises,
                featureMap: config.featureMap,
              })
            }
          )
        }
      )
    },
  }
}
