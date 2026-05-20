import { dietRouter } from './diet.router.js'
import { mealRouter } from './meal.router.js'
import { foodInMealRouter } from './foodInMeal.router.js'
import { foodRouter } from './food.router.js'
import { Router } from 'express'

const nutritionModuleRouter = Router()

nutritionModuleRouter.use('/', dietRouter)
nutritionModuleRouter.use('/', mealRouter)
nutritionModuleRouter.use('/', foodInMealRouter)
nutritionModuleRouter.use('/', foodRouter)

export { nutritionModuleRouter }
