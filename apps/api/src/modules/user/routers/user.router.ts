import { Router } from 'express'
import { UserRepository } from '../repositories/user.repository.js'
import { AuthRepository } from '../repositories/auth.repository.js'
import { UserService } from '../services/user.service.js'
import { UserController } from '../controllers/user.controller.js'

const userRoutes = Router()
const userRepo = new UserRepository()
const authRepo = new AuthRepository()
const userService = new UserService(userRepo, authRepo)
const userController = new UserController(userService)

userRoutes.post('/', userController.create)
userRoutes.get('/:id', userController.findById)
userRoutes.get('/', userController.findAll)
userRoutes.put('/:id', userController.update)
userRoutes.delete('/:id', userController.delete)

export { userRoutes }
