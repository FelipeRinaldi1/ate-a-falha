import { createUserWithAuthDTO, updateUserDTO } from '../DTOs/user.schema.js'
import { UserEntity } from '../entities/user.entity.js'
import type { IUserRepository } from '../interfaces/user.interfaces.js'
import type { IAuthRepository } from '../interfaces/auth.interfaces.js'
import { success, failure, Result } from '@/@utils/result.js'

export class UserService {
	constructor(
		private userRepository: IUserRepository,
		private authRepository: IAuthRepository
	) {}

	async create(data: createUserWithAuthDTO): Promise<Result<UserEntity>> {
		const { auth, ...userData } = data

		const userResult = await this.userRepository.create(userData)
		if (userResult.isFailure()) return failure(userResult.error)

		const userId = userResult.value.id

		const authResult = await this.authRepository.create(auth, userId)
		if (authResult.isFailure()) {
			await this.userRepository.delete(userId)
			return failure(authResult.error)
		}

		userResult.value.auth = authResult.value
		return success(userResult.value)
	}

	async findById(id: string): Promise<Result<UserEntity>> {
		const result = await this.userRepository.findById(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findAll(): Promise<Result<UserEntity[]>> {
		const result = await this.userRepository.findAll()
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async update(id: string, data: updateUserDTO): Promise<Result<UserEntity>> {
		const { auth, ...userData } = data
		const userResult = await this.userRepository.update(id, userData)
		if (userResult.isFailure()) return failure(userResult.error)

		if (auth) {
			const authResult = await this.authRepository.update(id, auth)
			if (authResult.isFailure()) return failure(authResult.error)
			userResult.value.auth = authResult.value
		}

		return success(userResult.value)
	}

	async delete(id: string): Promise<Result<void>> {
		const result = await this.userRepository.delete(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
}
