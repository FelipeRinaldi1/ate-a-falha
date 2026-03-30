import { Router } from 'express'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'
import { ExerciseRepository } from '../repositories/exercise.repository.js'
import { ExerciseService } from '../services/exercise.service.js'
import { ExerciseController } from '../controllers/exercise.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'

const exerciseRouter = Router()
const exerciseRepo = new ExerciseRepository()
const accessRepo = new WorkoutAccessControlRepository()
const accessService = new WorkoutAccessControlService(accessRepo)
const exerciseService = new ExerciseService(exerciseRepo, accessService)
const exerciseController = new ExerciseController(exerciseService)

exerciseRouter.get('/', ensureAuthenticated, exerciseController.findAll)
exerciseRouter.get('/:id', ensureAuthenticated, exerciseController.findById)

exerciseRouter.post('/', ensureAuthenticated, exerciseController.create)
exerciseRouter.patch('/:id', ensureAuthenticated, exerciseController.update)
exerciseRouter.delete('/:id', ensureAuthenticated, exerciseController.delete)

export { exerciseRouter }
