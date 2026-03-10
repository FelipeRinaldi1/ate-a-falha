import { Router } from 'express'
import { ExerciseFactory } from '../factory/exercise.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const exerciseRouter = Router()
const exerciseController = ExerciseFactory.createController()

exerciseRouter.get('/', ensureAuthenticated, exerciseController.findAll)
exerciseRouter.get('/:id', ensureAuthenticated, exerciseController.findById)

exerciseRouter.post('/', ensureAuthenticated, exerciseController.create)
exerciseRouter.patch('/:id', ensureAuthenticated, exerciseController.update)
exerciseRouter.delete('/:id', ensureAuthenticated, exerciseController.delete)

export { exerciseRouter }
