let usersApi

function login (request, response) {
  if (request.method === 'POST') {
    usersApi.login(
      request.body.username,
      request.body.password,
      (error, user) => {
        if (error || !user) {
          console.error(
            'Following error occurred during login: ' +
            error.message
          )
          })
        }
        else {
          request.session.user = user
          response.redirect('/' + user.username)
          response.render(page, {page, error, featureMap})
        }
      }
    )
  }
  else {
    response.render('login', {
      page: 'login',
    })
  }
}


module.exports = function (config) {
  usersApi = require('../api/users')(config)

  return login
}
