const mongo = require('mongodb')
const bcrypt = require('bcrypt')

const connectionString = `mongodb://localhost:27017`


mongo.MongoClient.connect(connectionString, (error, client) => {
  if (error) {
    console.error(error)
    return
  }

  const db = client.db('educatopia-dev')

  if (!db) {
    console.error(`Could not connect to database "${db.name}"`)
    return
  }

  console.info(`Connected to database "${db.databaseName}"`)

  const users = db.collection('users')
  const now = new Date()

  bcrypt.hash('test', 16, (error, hash) => {
    if (error) {
      console.error(error)
      return
    }

    const userData = {
      username: 'test',
      email: 'test@example.org',
      createdAt: now,
      updatedAt: now,
      password: hash,
    }

    const currentExercise = {
      createdAt: now,
      createdBy: 'test',
      task: 'Finish this task and you\'re golden!',
      subjects: ['Math', 'Biology'],
      hints: [],
      approach: 'First you this and then that.',
      solutions: ['This is the most important solution'],
      type: 'List',
      credits: 5,
      difficulty: 0.4,
      duration: 15,
      tags: ['just', 'test'],
      note: 'A short note!',
    }
    const exerciseData = {
      updatedAt: now,
      current: Object.assign({}, currentExercise),
      history: [Object.assign({}, currentExercise)],
    }

    const manyExercises = Array(20)
      .fill(exerciseData)
      .map(e => Object.assign({}, e))

    db
      .collection('users')
      .insertOne(
        userData,
        { safe: true },
        (insertError) => {
          if (insertError) {
            console.error(insertError)
          }

          db
            .collection('exercises')
            .insertMany(
              manyExercises,
              { safe: true },
              (insertError) => {
                if (insertError) {
                  console.error(insertError)
                }
                client.close()
              }
            )
        }
      )



   })
})
