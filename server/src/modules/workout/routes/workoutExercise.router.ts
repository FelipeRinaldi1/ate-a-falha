import { Router } from 'express'

import { WorkoutExerciseFactory } from '../factory/workoutExercise.factory.js'

const workoutExerciseRouter = Router()

const workoutExerciseController = WorkoutExerciseFactory.createController()

workoutExerciseRouter.get('/workouts/:workoutId/exercises', workoutExerciseController.findAll)
workoutExerciseRouter.post('/workouts/:workoutId/exercises', workoutExerciseController.create)
workoutExerciseRouter
workoutExerciseRouter.get('/workout-exercises/:id', workoutExerciseController.findById)
workoutExerciseRouter.patch('/workout-exercises/:id', workoutExerciseController.update)
workoutExerciseRouter.delete('/workout-exercises/:id', workoutExerciseController.delete)

export { workoutExerciseRouter }
