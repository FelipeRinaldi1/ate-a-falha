import {
	type CreateMealDTO,
	type UpdateMealDTO,
	type CreateMealLogDTO,
	type UpdateMealLogDTO,
	type Result,
} from '@ate-a-falha/shared'
import { type MealFull, type MealLogFull } from '@ate-a-falha/database'

export interface IMealRepository {
	create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealFull>>

	findAll(dietId: string, userId: string): Promise<Result<MealFull[]>>

	findById(id: string, userId: string): Promise<Result<MealFull>>

	update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealFull>>

	delete(id: string, userId: string): Promise<Result<void>>
}

export interface IMealLogRepository {
	createLog(dietLogId: string, data: CreateMealLogDTO): Promise<Result<MealLogFull>>

	findAllLogs(dietLogId: string, userId: string): Promise<Result<MealLogFull[]>>

	findLogById(id: string, userId: string): Promise<Result<MealLogFull>>

	updateLog(id: string, data: UpdateMealLogDTO, userId: string): Promise<Result<MealLogFull>>

	deleteLog(id: string, userId: string): Promise<Result<void>>
}
