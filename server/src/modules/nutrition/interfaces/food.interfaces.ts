import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../DTOs/food.schema.js'
import { FoodEntity } from '../entities/food.entity.js'
import { Result } from '@/utils/result.js'

export interface IFoodRepository {
	create(data: createFoodDTO, userId?: string): Promise<Result<FoodEntity>>

	findAll(data: foodSearchDTO, userId: string): Promise<Result<FoodEntity[]>>

	findById(id: string, userId?: string): Promise<Result<FoodEntity>>

	update(id: string, data: updateFoodDTO, userId?: string): Promise<Result<FoodEntity>>

	delete(id: string, userId: string): Promise<Result<void>>
}

export interface FoodSearchResult {
	items: FoodEntity[] | FoodEntity
	total: number
	currentPage: number
	totalPages: number
}
