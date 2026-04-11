import { CreateFoodDTO, FoodSearchDTO, UpdateFoodDTO } from "@ate-a-falha/shared"
import { FoodFull } from "@ate-a-falha/database"

import type { IFoodRepository } from '../interfaces/food.interfaces.js'
import { success, failure, Result } from "@ate-a-falha/shared"

import { authenticatedUser } from "@ate-a-falha/shared"

import { NutritionAccessControlService } from './nutritionAccessControl.service.js'

export class FoodService {
	constructor(
		private foodRepository: IFoodRepository,
		private accessControl: NutritionAccessControlService
	) {}

	async create(data: CreateFoodDTO, authUser: authenticatedUser): Promise<Result<FoodFull>> {
		const ownerId = authUser.role === 'ADMIN' ? undefined : authUser.id

		const result = await this.foodRepository.create(data, ownerId)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(id: string, data: UpdateFoodDTO, authUser: authenticatedUser): Promise<Result<FoodFull>> {
		const access = await this.accessControl.canAccessFood(id, authUser)
		if (access.isFailure()) return failure(access.error)

		const ownerId = authUser.role === 'ADMIN' ? undefined : authUser.id
		return await this.foodRepository.update(id, data, ownerId)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessFood(id, authUser)
		if (access.isFailure()) return failure(access.error)

		const ownerId = authUser.role === 'ADMIN' ? undefined : authUser.id
		return await this.foodRepository.delete(id, ownerId)
	}

	async findAll(data: FoodSearchDTO, authUser: authenticatedUser): Promise<Result<FoodFull[]>> {
		const isAdmin = authUser.role === 'ADMIN'
		const userId = isAdmin ? undefined : authUser.id
		const result = await this.foodRepository.findAll(data, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<FoodFull>> {
		const access = await this.accessControl.canAccessFood(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodRepository.findById(id)
	}
}
