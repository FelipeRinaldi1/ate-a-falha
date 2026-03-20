import { Result } from '@/@utils/result.js'
import { MealEntity } from '../entities/meal.enitity.js'
import { CreateMealDTO, UpdateMealDTO } from '../DTOs/meal.schema.js'

export interface IMealRepository {
	create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealEntity>>

	findAll(dietId: string, userId: string): Promise<Result<MealEntity[]>>

	findById(id: string, userId: string): Promise<Result<MealEntity>>

	update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealEntity>>

	delete(id: string, userId: string): Promise<Result<void>>
}
