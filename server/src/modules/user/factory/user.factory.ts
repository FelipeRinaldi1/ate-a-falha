import { UserRepository } from '../repositories/user.repository.js'
import { AuthRepository } from '../repositories/auth.repository.js'
import { UserService } from '../services/user.service.js'
import { UserController } from '../controllers/user.controller.js'

export class UserFactory {
	static createController() {
		const userRepository = new UserRepository()
		const authRepository = new AuthRepository()
		const userService = new UserService(userRepository, authRepository)
		return new UserController(userService)
	}
}
