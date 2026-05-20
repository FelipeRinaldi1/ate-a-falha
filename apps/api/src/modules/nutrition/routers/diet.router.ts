import { Router } from 'express'
import { DietController } from '../controllers/diet.controller.js'
import { DietRepository } from '../repositories/diet.repository.js'
import { DietService } from '../services/diet.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const dietRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const dietRepo = new DietRepository()
const dietService = new DietService(dietRepo, accessServ)
const dietController = new DietController(dietService)

dietRouter.use(ensureAuthenticated)

dietRouter.post('/diets', dietController.create)
dietRouter.get('/diets', dietController.findAll)
dietRouter.get('/diets/:id', dietController.findById)
dietRouter.patch('/diets/:id', dietController.update)
dietRouter.delete('/diets/:id', dietController.delete)

export { dietRouter }
