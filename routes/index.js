const mongo = require('mongodb')

module.exports = config => {
  return (request, response) => {
    const ids = config.featuredExercises
      .map(exId => mongo.ObjectId(exId))

    config.database
      .collection('exercises')
      .find({ _id: { $in: ids } })
      .toArray((error, exercises) => {
        const exercisesSorted = ids
          .map(id => exercises.find(e => e._id.equals(id)))

        response.render('index', {
          page: 'home',
          featureMap: config.featureMap,
          featuredExercises: exercisesSorted
            ? exercisesSorted.map(e => Object.assign({id: e._id}, e.current))
            : [],
        })
      })
  }
}
