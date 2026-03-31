import { Router } from 'express'
import { MealController } from '../controllers/meal.controller.js'
import { MealRepository } from '../repositories/meal.repository.js'
import { MealService } from '../services/meal.service.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'
import { ensureAuthenticated } from 'apps/api/src/middlewares/ensureAuthenticated.js'

const mealRouter = Router()

const accessRepo = new NutritionAccessControlRepository()
const accessServ = new NutritionAccessControlService(accessRepo)
const mealRepo = new MealRepository()
const mealService = new MealService(mealRepo, accessServ)
const mealController = new MealController(mealService)

mealRouter.use(ensureAuthenticated)

mealRouter.post('/', mealController.create)
mealRouter.get('/', mealController.findAll)
mealRouter.get('/:id', mealController.findById)
mealRouter.put('/:id', mealController.update)
mealRouter.delete('/:id', mealController.delete)

export { mealRouter }
