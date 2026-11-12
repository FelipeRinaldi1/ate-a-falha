import { Router } from 'express'
import { ensureAuthenticated } from '../../../middlewares/ensureAuthenticated.js'
import { PlanRepository } from '../repositories/plan.repository.js'
import { PlanService } from '../services/plan.service.js'
import { PlanController } from '../controllers/plan.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'
import { NotificationRepository } from '../../notification/repositories/notification.repository.js'
import { NotificationService } from '../../notification/services/notification.service.js'

const planRouter = Router()
const planRepo = new PlanRepository()
const accessRepo = new WorkoutAccessControlRepository()
const accessService = new WorkoutAccessControlService(accessRepo)
const notificationService = new NotificationService(new NotificationRepository())
const planService = new PlanService(planRepo, accessService, notificationService)
const planController = new PlanController(planService)

planRouter.get('/plans/:id/export', planController.export)

planRouter.use(ensureAuthenticated)

planRouter.post('/plans', planController.create)

planRouter.get('/plans', planController.findAll)

planRouter.get('/plans/:id', planController.findById)

planRouter.patch('/plans/:id', planController.update)

planRouter.delete('/plans/:id', planController.delete)

planRouter.post('/plans/:id/import', planController.import)

export { planRouter }
