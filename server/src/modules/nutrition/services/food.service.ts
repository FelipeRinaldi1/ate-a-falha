import { CreateFoodDTO, FoodSearchDTO, UpdateFoodDTO } from '../DTOs/food.schema.js'
import { FoodEntity } from '../entities/food.entity.js'
import type { IFoodRepository } from '../interfaces/food.interfaces.js'
import { success, failure, Result } from '@/@utils/result.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'

export class FoodService {
	constructor(
		private foodRepository: IFoodRepository,
		private accessControl: NutritionAccessControlService
	) {}

	async create(data: CreateFoodDTO, authUser: authenticatedUser): Promise<Result<FoodEntity>> {
		const ownerId = authUser.role === 'ADMIN' ? undefined : authUser.id

		const result = await this.foodRepository.create(data, ownerId)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(id: string, data: UpdateFoodDTO, authUser: authenticatedUser): Promise<Result<FoodEntity>> {
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

	async findAll(data: FoodSearchDTO, authUser: authenticatedUser): Promise<Result<FoodEntity[]>> {
		const isAdmin = authUser.role === 'ADMIN'
		const userId = isAdmin ? undefined : authUser.id
		const result = await this.foodRepository.findAll(data, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<FoodEntity>> {
		const access = await this.accessControl.canAccessFood(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodRepository.findById(id)
	}
}
