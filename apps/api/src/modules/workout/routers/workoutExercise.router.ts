import { Router } from 'express'

import { WorkoutExerciseRepository } from '../repositories/workoutExercise.repository.js'
import { WorkoutExerciseService } from '../services/workoutExercise.service.js'
import { WorkoutExerciseController } from '../controllers/workoutExercise.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'
import { ensureAuthenticated } from '../../../@middlewares/ensureAuthenticated.js'
const workoutExerciseRepo = new WorkoutExerciseRepository()
const accessRepo = new WorkoutAccessControlRepository()
const accessService = new WorkoutAccessControlService(accessRepo)
const workoutExerciseService = new WorkoutExerciseService(workoutExerciseRepo, accessService)
const workoutExerciseController = new WorkoutExerciseController(workoutExerciseService)
const workoutExerciseRouter = Router()

workoutExerciseRouter.use(ensureAuthenticated)

workoutExerciseRouter.get('/workouts/:workoutId/exercises', workoutExerciseController.findAll)
workoutExerciseRouter.post('/workouts/:workoutId/exercises', workoutExerciseController.create)
workoutExerciseRouter.get('/workout-exercises/:id', workoutExerciseController.findById)
workoutExerciseRouter.patch('/workout-exercises/:id', workoutExerciseController.update)
workoutExerciseRouter.delete('/workout-exercises/:id', workoutExerciseController.delete)

export { workoutExerciseRouter }
