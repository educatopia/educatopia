module.exports = config => {
  return (request, response) => {
    response.render('index', {
      page: 'home',
      featureMap: config.featureMap,
    })
  }
}
