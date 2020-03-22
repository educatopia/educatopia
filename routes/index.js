const mongo = require('mongodb')

module.exports = config => {
  return (request, response) => {
    const exercisesQuery = {
      $or: config.featuredExercises
        .map(exId => ({ _id: mongo.ObjectId(exId) })),
    }

    config.database
      .collection('exercises')
      .find(exercisesQuery)
      .toArray((error, exercises) => {
        response.render('index', {
          page: 'home',
          featureMap: config.featureMap,
          featuredExercises: exercises
            ? exercises.map(e => Object.assign({id: e._id}, e.current))
            : [],
        })
      })
  }
}

