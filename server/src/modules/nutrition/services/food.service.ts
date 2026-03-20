import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../DTOs/food.schema.js'
import { FoodEntity } from '../entities/food.entity.js'
import type { IFoodRepository } from '../interfaces/food.interfaces.js'
import { success, failure, Result } from '@/@utils/result.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'

export class FoodService {
	constructor(private foodRepository: IFoodRepository) {}

	private async validatePermission(
		id: string,
		authUser: authenticatedUser
	): Promise<Result<FoodEntity>> {
		const result = await this.foodRepository.findById(id)
		if (result.isFailure()) return failure(result.error)

		const food = result.value
		const isAdmin = authUser.role === 'ADMIN'
		const isOwner = food.userId === authUser.id

		if (isAdmin || isOwner) {
			return success(food)
		}

		return failure({
			type: 'FORBIDDEN',
			message: 'You do not have permission to modify this food item.',
		})
	}

	async create(data: createFoodDTO, authUser: authenticatedUser): Promise<Result<FoodEntity>> {
		const ownerId = authUser.role === 'ADMIN' ? undefined : authUser.id

		const result = await this.foodRepository.create(data, ownerId)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<FoodEntity>> {
		const result = await this.foodRepository.findById(id)

		if (result.isFailure()) return failure(result.error)

		const food = result.value

		const isAdmin = authUser.role === 'ADMIN'
		const isOwner = food.userId === authUser.id
		const isGlobal = !food.userId

		if (isAdmin || isOwner || isGlobal) {
			return success(food)
		}

		return failure({
			type: 'FORBIDDEN',
			message: 'Access denied for this food item.',
		})
	}

	async findAll(data: foodSearchDTO, authUser: authenticatedUser): Promise<Result<FoodEntity[]>> {
		const isAdmin = authUser.role === 'ADMIN'
		const userId = isAdmin ? undefined : authUser.id
		const result = await this.foodRepository.findAll(data, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(
		id: string,
		data: updateFoodDTO,
		authUser: authenticatedUser
	): Promise<Result<FoodEntity>> {
		const check = await this.validatePermission(id, authUser)

		if (check.isFailure()) return failure(check.error)

		const result = await this.foodRepository.update(id, data)

		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const check = await this.validatePermission(id, authUser)

		if (check.isFailure()) return failure(check.error)

		const result = await this.foodRepository.delete(id)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
