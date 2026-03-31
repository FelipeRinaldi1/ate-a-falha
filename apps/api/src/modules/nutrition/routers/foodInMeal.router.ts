import { Router } from 'express'
import { FoodInMealController } from '../controllers/foodInMeal.controller.js'
import { FoodInMealRepository } from '../repositories/foodInMeal.repository.js'
import { FoodInMealService } from '../services/foodInMeal.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from 'apps/api/src/@middlewares/ensureAuthenticated.js'

const foodInMealRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const foodInMealRepo = new FoodInMealRepository()
const foodInMealService = new FoodInMealService(foodInMealRepo, accessServ)
const foodInMealController = new FoodInMealController(foodInMealService)

foodInMealRouter.use(ensureAuthenticated)

foodInMealRouter.post('/meal/:mealId/food/:foodId', foodInMealController.create)
foodInMealRouter.get('/meal/:mealId', foodInMealController.findAll)
foodInMealRouter.get('/:id', foodInMealController.findById)
foodInMealRouter.patch('/:id', foodInMealController.update)
foodInMealRouter.delete('/:id', foodInMealController.delete)

export { foodInMealRouter }
