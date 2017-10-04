let usersApi

function signup (request, response) {
  if (request.session.user) {
    delete response.locals.session
    request.session.destroy()
  }

  if (request.method !== 'POST') {
    response.render('signup', {
      page: 'signup',
    })
    return
  }

  usersApi.signup(
    request,
    (error, data) => {
      if (error) {
        console.error(error)
      }
      else {
        response.render('signup', {
          page: 'signup',
          data: data,
        })
      }
    }
  )
}

module.exports = function (config) {
  usersApi = require('../api/users')(config)

  return signup
}
