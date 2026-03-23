import { Router } from 'express'
import { MealFactory } from '../factory/meal.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const mealRouter = Router()

const mealController = MealFactory.createController()

mealRouter.use(ensureAuthenticated)

mealRouter.post('/', mealController.create)
mealRouter.get('/', mealController.findAll)
mealRouter.get('/:id', mealController.findById)
mealRouter.put('/:id', mealController.update)
mealRouter.delete('/:id', mealController.delete)

export { mealRouter }
