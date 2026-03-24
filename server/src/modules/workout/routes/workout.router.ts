import { WorkoutFactory } from '../factory/workout.factory.js'
import { Router } from 'express'
const workoutController = WorkoutFactory.createController()
const workoutRouter = Router()
workoutRouter.post('/plans/:planId/workouts', workoutController.create)
workoutRouter.get('/plans/:planId/workouts', workoutController.findAll)

workoutRouter.patch('/workouts/:id', workoutController.update)
workoutRouter.delete('/workouts/:id', workoutController.delete)
workoutRouter.get('/workouts/:id', workoutController.findById)

export { workoutRouter }
