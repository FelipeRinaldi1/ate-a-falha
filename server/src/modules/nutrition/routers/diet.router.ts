import { Router } from 'express'
import { DietFactory } from '../factory/diet.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const dietRouter = Router()

const dietController = DietFactory.createController()

dietRouter.use(ensureAuthenticated)

dietRouter.post('/', dietController.create)
dietRouter.get('/', dietController.findAll)
dietRouter.get('/:id', dietController.findById)
dietRouter.put('/:id', dietController.update)
dietRouter.delete('/:id', dietController.delete)

export { dietRouter }
