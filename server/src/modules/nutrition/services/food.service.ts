import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../DTOs/food.schema.js'
import { FoodEntity } from '../entities/food.entity.js'
import type { IFoodRepository } from '../interfaces/food.interfaces.js'
import { success, failure, Result } from '@/utils/result.js'

export class FoodService {
	constructor(private foodRepository: IFoodRepository) {}

	async create(data: createFoodDTO, userId?: string): Promise<Result<FoodEntity>> {
		const result = await this.foodRepository.create(data, userId)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<FoodEntity>> {
		const result = await this.foodRepository.findById(id, userId)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}
	async findAll(data: foodSearchDTO, userId: string): Promise<Result<FoodEntity[]>> {
		const result = await this.foodRepository.findAll(data, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(id: string, data: updateFoodDTO, userId: string): Promise<Result<FoodEntity>> {
		const result = await this.foodRepository.update(id, data, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await this.foodRepository.delete(id, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}
}
