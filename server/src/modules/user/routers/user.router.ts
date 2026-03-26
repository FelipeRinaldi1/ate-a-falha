import { Router } from 'express'
import { UserFactory } from '../factory/user.factory.js'

const userRoutes = Router()
const userController = UserFactory.createController()

userRoutes.post('/', userController.create)
userRoutes.get('/:id', userController.findById)
userRoutes.get('/', userController.findAll)
userRoutes.put('/:id', userController.update)
userRoutes.delete('/:id', userController.delete)

export { userRoutes }
