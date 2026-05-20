import { Router } from 'express'
import { ensureAuthenticated } from '../../../middlewares/ensureAuthenticated.js'
import { SetRepository } from '../repositories/set.repository.js'
import { SetService } from '../services/set.service.js'
import { SetController } from '../controllers/set.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'

const setRouter = Router()
const setRepo = new SetRepository()
const accessRepo = new WorkoutAccessControlRepository()
const accessService = new WorkoutAccessControlService(accessRepo)
const setService = new SetService(setRepo, accessService)
const setController = new SetController(setService)

setRouter.use(ensureAuthenticated)

setRouter.post('/workout-exercises/:workoutExerciseId/sets', setController.create)
setRouter.get('/workout-exercises/:workoutExerciseId/sets', setController.findAll)
setRouter.get('/sets/:id', setController.findById)
setRouter.patch('/sets/:id', setController.update)
setRouter.delete('/sets/:id', setController.delete)

export { setRouter }
