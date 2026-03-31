import { CreateFoodDTO, FoodSearchDTO, UpdateFoodDTO } from "@ate-a-falha/shared"
import { FoodFull } from "@ate-a-falha/database"

import { Result } from '@ate-a-falha/shared'

export interface IFoodRepository {
	create(data: CreateFoodDTO, userId?: string): Promise<Result<FoodFull>>

	findAll(data: FoodSearchDTO, userId?: string): Promise<Result<FoodFull[]>>

	findById(id: string): Promise<Result<FoodFull>>

	update(id: string, data: UpdateFoodDTO, userId?: string): Promise<Result<FoodFull>>

	delete(id: string, userId?: string): Promise<Result<void>>
}

export interface FoodSearchResult {
	items: FoodFull[] | FoodFull
	total: number
	currentPage: number
	totalPages: number
}
