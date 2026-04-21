import { Router } from 'express'
import { UserRepository } from '../repositories/user.repository.js'
import { AuthRepository } from '../repositories/auth.repository.js'
import { UserService } from '../services/user.service.js'
import { UserController } from '../controllers/user.controller.js'
import { ensureAuthenticated } from '../../../middlewares/ensureAuthenticated.js'

const userRouter = Router()
const userRepo = new UserRepository()
const authRepo = new AuthRepository()
const userService = new UserService(userRepo, authRepo)
const userController = new UserController(userService)

// Public
userRouter.post('/register', userController.register)
userRouter.post('/login', userController.login)
userRouter.post('/logout', userController.logout)

// Protected
userRouter.get('/me', ensureAuthenticated, userController.getMe)
userRouter.put('/me', ensureAuthenticated, userController.updateMe)
userRouter.delete('/me', ensureAuthenticated, userController.deleteMe)
userRouter.patch('/me/password', ensureAuthenticated, userController.changePassword)
userRouter.patch('/me/email', ensureAuthenticated, userController.changeEmail)
userRouter.post('/logout', userController.logout)

export { userRouter }
