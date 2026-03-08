import { Router } from 'express'
import { FoodFactory } from '../factory/food.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const foodRoutes = Router()
const foodController = FoodFactory.createController()

foodRoutes.use(ensureAuthenticated) 

foodRoutes.post('/', foodController.create)
foodRoutes.get('/:id', foodController.findById)
foodRoutes.post('/search', foodController.findAll)
foodRoutes.put('/:id', foodController.update)
foodRoutes.delete('/:id', foodController.delete)

export { foodRoutes }