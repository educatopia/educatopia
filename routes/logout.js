module.exports = () => {
  return (request, response) => {
    request.session.destroy()
    response.redirect('/')
  }
}
