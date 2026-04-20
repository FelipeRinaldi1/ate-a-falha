import { Router } from 'express'
import { FoodController } from '../controllers/food.controller.js'
import { FoodRepository } from '../repositories/food.repository.js'
import { FoodService } from '../services/food.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const foodRoutes = Router()
const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const foodRepo = new FoodRepository()
const foodService = new FoodService(foodRepo, accessServ)
const foodController = new FoodController(foodService)

foodRoutes.post('/', ensureAuthenticated, foodController.create)
foodRoutes.get('/:id', foodController.findById)
foodRoutes.get('/', foodController.findAll)
foodRoutes.put('/:id', ensureAuthenticated, foodController.update)
foodRoutes.delete('/:id', ensureAuthenticated, foodController.delete)

export { foodRoutes }
