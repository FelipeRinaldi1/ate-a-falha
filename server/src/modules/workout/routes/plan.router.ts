import { Router } from 'express'
import { PlanFactory } from '../factory/plan.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const planRouter = Router()

const planController = PlanFactory.createController()

planRouter.use(ensureAuthenticated)

planRouter.post('/', planController.create)

planRouter.get('/', planController.findAll)

planRouter.get('/:id', planController.findById)

planRouter.put('/:id', planController.update)

planRouter.delete('/:id', planController.delete)

export { planRouter }
