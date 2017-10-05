module.exports = config => {
  return (request, response) => {
    response.render('reference', {
      page: 'reference',
      featureMap: config.featureMap,
    })
  }
}
