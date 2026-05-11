import { type CreateMealDTO, type UpdateMealDTO, type Result } from '@ate-a-falha/shared'
import { type MealFull } from '@ate-a-falha/database/src/types/nutrition.js'

export interface IMealRepository {
	create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealFull>>

	findAll(dietId: string, userId: string): Promise<Result<MealFull[]>>

	findById(id: string, userId: string): Promise<Result<MealFull>>

	update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealFull>>

	delete(id: string, userId: string): Promise<Result<void>>
}
