import { Router } from 'express'
import { SetFactory } from '../factory/set.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const setRouter = Router()

const setController = SetFactory.createController()

setRouter.use(ensureAuthenticated)

setRouter.post('/exercise/:workoutExerciseId', setController.create)
setRouter.get('/exercise/:workoutExerciseId', setController.findAll)
setRouter.get('/:id', setController.findById)
setRouter.put('/:id', setController.update)
setRouter.delete('/:id', setController.delete)

export { setRouter }
