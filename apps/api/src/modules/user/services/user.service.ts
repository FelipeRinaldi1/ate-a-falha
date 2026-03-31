import { CreateUserWithAuthDTO, UpdateUserDTO } from "@ate-a-falha/shared"
import { UserFull } from "@ate-a-falha/database"

import type { IUserRepository } from '../interfaces/user.interfaces.js'
import type { IAuthRepository } from '../interfaces/auth.interfaces.js'
import { success, failure, Result } from "@ate-a-falha/shared"


export class UserService {
	constructor(
		private userRepository: IUserRepository,
		private authRepository: IAuthRepository
	) { }

	async create(data: CreateUserWithAuthDTO): Promise<Result<UserFull>> {
		const { auth, ...userData } = data

		const userResult = await this.userRepository.create(userData)
		if (userResult.isFailure()) return failure(userResult.error)

		const userId = userResult.value.id

		const authResult = await this.authRepository.create(auth, userId)
		if (authResult.isFailure()) {
			await this.userRepository.delete(userId)
			return failure(authResult.error)
		}

		return success({ ...userResult.value, auth: authResult.value })
	}

	async findById(id: string): Promise<Result<UserFull>> {
		const result = await this.userRepository.findById(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findAll(): Promise<Result<UserFull[]>> {
		const result = await this.userRepository.findAll()
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async update(id: string, data: UpdateUserDTO): Promise<Result<UserFull>> {
		const { auth, ...userData } = data
		const userResult = await this.userRepository.update(id, userData)
		if (userResult.isFailure()) return failure(userResult.error)

		if (auth) {
			const authResult = await this.authRepository.update(id, auth)
			if (authResult.isFailure()) return failure(authResult.error)
			return success({ ...userResult.value, auth: authResult.value })
		}

		return success(userResult.value)
	}

	async delete(id: string): Promise<Result<void>> {
		const result = await this.userRepository.delete(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
}
