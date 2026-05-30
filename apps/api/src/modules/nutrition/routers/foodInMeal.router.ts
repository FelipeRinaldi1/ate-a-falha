import { Router } from 'express'
import { FoodInMealController } from '../controllers/foodInMeal.controller.js'
import { FoodInMealRepository } from '../repositories/foodInMeal.repository.js'
import { FoodInMealService } from '../services/foodInMeal.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const foodInMealRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const foodInMealRepo = new FoodInMealRepository()
const foodInMealService = new FoodInMealService(foodInMealRepo, accessServ)
const foodInMealController = new FoodInMealController(foodInMealService)

foodInMealRouter.use(ensureAuthenticated)

foodInMealRouter.post('/meals/:mealId/foods', foodInMealController.create)
foodInMealRouter.get('/meals/:mealId/foods', foodInMealController.findAll)
foodInMealRouter.get('/food-in-meals/:id', foodInMealController.findById)
foodInMealRouter.patch('/food-in-meals/:id', foodInMealController.update)
foodInMealRouter.delete('/food-in-meals/:id', foodInMealController.delete)

// Log routes
foodInMealRouter.post('/meal-logs/:mealLogId/foods', foodInMealController.createLog)
foodInMealRouter.get('/meal-logs/:mealLogId/foods', foodInMealController.findAllLogs)
foodInMealRouter.get('/food-logs/:id', foodInMealController.findLogById)
foodInMealRouter.patch('/food-logs/:id', foodInMealController.updateLog)
foodInMealRouter.delete('/food-logs/:id', foodInMealController.deleteLog)

export { foodInMealRouter }
