import { Router } from 'express'
import { MealController } from '../controllers/meal.controller.js'
import { MealRepository } from '../repositories/meal.repository.js'
import { MealService } from '../services/meal.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'

const mealRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const mealRepo = new MealRepository()
const mealService = new MealService(mealRepo, accessServ)
const mealController = new MealController(mealService)

mealRouter.use(ensureAuthenticated)

mealRouter.post('/diets/:dietId/meals', mealController.create)
mealRouter.get('/diets/:dietId/meals', mealController.findAll)
mealRouter.get('/meals/:id', mealController.findById)
mealRouter.patch('/meals/:id', mealController.update)
mealRouter.delete('/meals/:id', mealController.delete)

// MealLog routes
mealRouter.post('/diet-logs/:dietLogId/meals', mealController.createLog)
mealRouter.get('/diet-logs/:dietLogId/meals', mealController.findAllLogs)
mealRouter.get('/meal-logs/:id', mealController.findLogById)
mealRouter.patch('/meal-logs/:id', mealController.updateLog)
mealRouter.delete('/meal-logs/:id', mealController.deleteLog)

export { mealRouter }
