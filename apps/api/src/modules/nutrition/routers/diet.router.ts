import { Router } from 'express'
import { DietController } from '../controllers/diet.controller.js'
import { DietRepository } from '../repositories/diet.repository.js'
import { DietService } from '../services/diet.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'
import { NotificationRepository } from '../../notification/repositories/notification.repository.js'
import { NotificationService } from '../../notification/services/notification.service.js'

const dietRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const dietRepo = new DietRepository()
const notificationService = new NotificationService(new NotificationRepository())
const dietService = new DietService(dietRepo, accessServ, notificationService)
const dietController = new DietController(dietService)

dietRouter.get('/diets/:id/export', dietController.export)

dietRouter.use(ensureAuthenticated)

dietRouter.post('/diets', dietController.create)
dietRouter.get('/diets', dietController.findAll)
dietRouter.get('/diets/:id', dietController.findById)
dietRouter.patch('/diets/:id', dietController.update)
dietRouter.delete('/diets/:id', dietController.delete)
dietRouter.post('/diets/:id/import', dietController.import)

// DietLog routes
dietRouter.post('/diet-logs', dietController.createLog)
dietRouter.get('/diet-logs', dietController.findAllLogs)
dietRouter.get('/diet-logs/:id', dietController.findLogById)
dietRouter.patch('/diet-logs/:id', dietController.updateLog)
dietRouter.delete('/diet-logs/:id', dietController.deleteLog)

export { dietRouter }
