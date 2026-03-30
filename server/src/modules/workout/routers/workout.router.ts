import { Router } from 'express'
import { WorkoutRepository } from '../repositories/workout.repository.js'
import { WorkoutService } from '../services/workout.service.js'
import { WorkoutController } from '../controllers/workout.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const workoutRepo = new WorkoutRepository()
const accessRepo = new WorkoutAccessControlRepository()
const accessService = new WorkoutAccessControlService(accessRepo)
const workoutService = new WorkoutService(workoutRepo, accessService)
const workoutController = new WorkoutController(workoutService)
const workoutRouter = Router()

workoutRouter.use(ensureAuthenticated)
workoutRouter.post('/plans/:planId/workouts', workoutController.create)
workoutRouter.get('/plans/:planId/workouts', workoutController.findAll)

workoutRouter.patch('/workouts/:id', workoutController.update)
workoutRouter.delete('/workouts/:id', workoutController.delete)
workoutRouter.get('/workouts/:id', workoutController.findById)

export { workoutRouter }
