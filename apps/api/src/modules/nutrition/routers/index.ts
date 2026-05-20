import { dietRouter } from './diet.router.js'
import { mealRouter } from './meal.router.js'
import { foodInMealRouter } from './foodInMeal.router.js'
import { foodRouter } from './food.router.js'
import { Router } from 'express'

const nutritionModuleRouter = Router()

nutritionModuleRouter.use('/diet', dietRouter)
nutritionModuleRouter.use('/meal', mealRouter)
nutritionModuleRouter.use('/food-in-meal', foodInMealRouter)
nutritionModuleRouter.use('/food-catalog', foodRouter)

export { nutritionModuleRouter }
