const usersApi = require('../api/users')
const page = 'login'

module.exports = config => {
  const {login} = usersApi(config)
  const {featureMap} = config

  return (request, response) => {
    if (request.method !== 'POST') {
      response.render(page, {page, featureMap})
      return
    }

    login(
      request.body.username,
      request.body.password,
      (error, user) => {
        if (error) {
          console.error(
            `Following error occurred during login: ${error.message}`
          )
          response.render(page, {page, error, featureMap})
          return
        }

        request.session.user = user
        response.redirect(`/${user.username}`)
      }
    )
  }
}
