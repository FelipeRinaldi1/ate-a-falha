import { Router } from 'express'
import { ensureAuthenticated } from '../../../middlewares/ensureAuthenticated.js'
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

planRouter.post('/plans', planController.create)

planRouter.get('/plans', planController.findAll)

planRouter.get('/plans/:id', planController.findById)

planRouter.patch('/plans/:id', planController.update)

planRouter.delete('/plans/:id', planController.delete)

export { planRouter }
