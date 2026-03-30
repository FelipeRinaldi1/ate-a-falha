import { Result } from '@/@utils/result.js'
import { CreateMealDTO, UpdateMealDTO, MealFull } from '../schema/meal.schema.js'

export interface IMealRepository {
	create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealFull>>

	findAll(dietId: string, userId: string): Promise<Result<MealFull[]>>

	findById(id: string, userId: string): Promise<Result<MealFull>>

	update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealFull>>

	delete(id: string, userId: string): Promise<Result<void>>
}
