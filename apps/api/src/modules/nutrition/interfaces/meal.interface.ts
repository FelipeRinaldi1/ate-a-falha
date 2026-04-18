import { Result } from '@ate-a-falha/shared'

import { CreateMealDTO, UpdateMealDTO } from '@ate-a-falha/shared'
import { MealFull } from '@ate-a-falha/database'

export interface IMealRepository {
	create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealFull>>

	findAll(dietId: string, userId: string): Promise<Result<MealFull[]>>

	findById(id: string, userId: string): Promise<Result<MealFull>>

	update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealFull>>

	delete(id: string, userId: string): Promise<Result<void>>
}
