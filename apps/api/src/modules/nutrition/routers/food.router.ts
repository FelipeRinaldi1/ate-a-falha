import { Router } from 'express'
import { FoodController } from '../controllers/food.controller.js'
import { FoodRepository } from '../repositories/food.repository.js'
import { FoodService } from '../services/food.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const foodRouter = Router()
const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const foodRepo = new FoodRepository()
const foodService = new FoodService(foodRepo, accessServ)
const foodController = new FoodController(foodService)

foodRouter.post('/', ensureAuthenticated, foodController.create)
foodRouter.get('/:id', foodController.findById)
foodRouter.get('/', foodController.findAll)
foodRouter.put('/:id', ensureAuthenticated, foodController.update)
foodRouter.delete('/:id', ensureAuthenticated, foodController.delete)

export { foodRouter }
