const usersApi = require('../api/users')
const page = 'signup'

module.exports = config => {
  const {signup} = usersApi(config)
  const {featureMap} = config

  return (request, response) => {
    if (request.session.user) {
      delete response.locals.session
      request.session.destroy()
    }

    if (request.method !== 'POST') {
      response.render(page, {page, featureMap})
      return
    }

    signup(
      request,
      (error, message) => {
        if (error) {
          console.error(error)
          response.render(page, {page, error, featureMap})
          return
        }

        response.render(page, {page, message, featureMap})
      }
    )
  }
}
