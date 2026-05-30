import {
	type CreateFoodInMealDTO,
	type UpdateFoodInMealDTO,
	type CreateFoodLogDTO,
	type UpdateFoodLogDTO,
	type Result,
} from '@ate-a-falha/shared'
import { type FoodInMealFull, type FoodLogFull } from '@ate-a-falha/database'

export interface IFoodInMealRepository {
	create(mealId: string, foodId: string, data: CreateFoodInMealDTO, userId: string): Promise<Result<FoodInMealFull>>

	findAll(mealId: string, userId: string): Promise<Result<FoodInMealFull[]>>

	findById(id: string, userId: string): Promise<Result<FoodInMealFull>>

	update(id: string, data: UpdateFoodInMealDTO, userId: string): Promise<Result<FoodInMealFull>>

	delete(id: string, userId: string): Promise<Result<void>>
}

export interface IFoodLogRepository {
	createLog(mealLogId: string, foodId: string, data: CreateFoodLogDTO, userId: string): Promise<Result<FoodLogFull>>

	findAllLogs(mealLogId: string, userId: string): Promise<Result<FoodLogFull[]>>

	findLogById(id: string, userId: string): Promise<Result<FoodLogFull>>

	updateLog(id: string, data: UpdateFoodLogDTO, userId: string): Promise<Result<FoodLogFull>>

	deleteLog(id: string, userId: string): Promise<Result<void>>
}
