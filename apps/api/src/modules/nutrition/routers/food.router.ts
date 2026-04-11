import { Router } from 'express'
import { FoodController } from '../controllers/food.controller.js'
import { FoodRepository } from '../repositories/food.repository.js'
import { FoodService } from '../services/food.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from 'apps/api/src/middlewares/ensureAuthenticated.js'

const foodRoutes = Router()
const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const foodRepo = new FoodRepository()
const foodService = new FoodService(foodRepo, accessServ)
const foodController = new FoodController(foodService)

foodRoutes.use(ensureAuthenticated)

foodRoutes.post('/', foodController.create)
foodRoutes.get('/:id', foodController.findById)
foodRoutes.post('/search', foodController.findAll)
foodRoutes.put('/:id', foodController.update)
foodRoutes.delete('/:id', foodController.delete)

export { foodRoutes }