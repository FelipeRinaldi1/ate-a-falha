import { Router } from 'express'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'
import { PlanRepository } from '../repositories/plan.repository.js'
import { PlanService } from '../services/plan.service.js'
import { PlanController } from '../controllers/plan.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'

const planRouter = Router()
const planRepo = new PlanRepository()
const accessRepo = new WorkoutAccessControlRepository()
const accessService = new WorkoutAccessControlService(accessRepo)
const planService = new PlanService(planRepo, accessService)
const planController = new PlanController(planService)

planRouter.use(ensureAuthenticated)

planRouter.post('/', planController.create)

planRouter.get('/', planController.findAll)

planRouter.get('/:id', planController.findById)

planRouter.put('/:id', planController.update)

planRouter.delete('/:id', planController.delete)

export { planRouter }
