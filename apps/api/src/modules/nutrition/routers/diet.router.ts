import { Router } from 'express'
import { DietController } from '../controllers/diet.controller.js'
import { DietRepository } from '../repositories/diet.repository.js'
import { DietService } from '../services/diet.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { ensureAuthenticated } from 'apps/api/src/middlewares/ensureAuthenticated.js'

const dietRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const dietRepo = new DietRepository()
const dietService = new DietService(dietRepo, accessServ)
const dietController = new DietController(dietService)

dietRouter.use(ensureAuthenticated)

dietRouter.post('/', dietController.create)
dietRouter.get('/', dietController.findAll)
dietRouter.get('/:id', dietController.findById)
dietRouter.put('/:id', dietController.update)
dietRouter.delete('/:id', dietController.delete)

export { dietRouter }
