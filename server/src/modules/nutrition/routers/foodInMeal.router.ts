import { Router } from 'express'
import { FoodInMealFactory } from '../factory/foodInMeal.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const foodInMealRouter = Router()

const foodInMealController = FoodInMealFactory.createController()

foodInMealRouter.use(ensureAuthenticated)

foodInMealRouter.post('/meal/:mealId/food/:foodId', foodInMealController.create)
foodInMealRouter.get('/meal/:mealId', foodInMealController.findAll)
foodInMealRouter.get('/:id', foodInMealController.findById)
foodInMealRouter.patch('/:id', foodInMealController.update)
foodInMealRouter.delete('/:id', foodInMealController.delete)

export { foodInMealRouter }
