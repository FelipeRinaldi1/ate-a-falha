import { failure, Result, success } from '@ate-a-falha/shared'
import { IFoodInMealRepository, IFoodLogRepository } from '../interfaces/foodInMeal.interface.js'
import {
	type CreateFoodInMealDTO,
	type UpdateFoodInMealDTO,
	type CreateFoodLogDTO,
	type UpdateFoodLogDTO,
} from '@ate-a-falha/shared'
import { type FoodInMealFull, type FoodLogFull } from '@ate-a-falha/database'
import { prisma, safeCall } from '@ate-a-falha/database'

export class FoodInMealRepository implements IFoodInMealRepository, IFoodLogRepository {
	// Plan / Template FoodInMeal CRUD
	async create(mealId: string, foodId: string, data: CreateFoodInMealDTO): Promise<Result<FoodInMealFull>> {
		const result = await safeCall(
			prisma.foodInMeal.create({
				data: {
					...data,
					mealId: mealId,
					foodId: foodId,
				},
				include: { food: true },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findAll(mealId: string, userId: string): Promise<Result<FoodInMealFull[]>> {
		const result = await safeCall(
			prisma.foodInMeal.findMany({
				where: {
					mealId: mealId,
					meal: {
						diet: {
							userId: userId,
						},
					},
				},
				include: { food: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<FoodInMealFull>> {
		const result = await safeCall(
			prisma.foodInMeal.findFirstOrThrow({
				where: {
					id: id,
					meal: { diet: { userId: userId } },
				},
				include: { food: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateFoodInMealDTO, _userId: string): Promise<Result<FoodInMealFull>> {
		const result = await safeCall(
 			prisma.foodInMeal.update({
 				where: { id },
 				data: data,
 				include: { food: true },
 			})
 		)
 		if (result.isFailure()) return failure(result.error)

 		return success(result.value)
 	}

 	async delete(id: string, _userId: string): Promise<Result<void>> {
 		const result = await safeCall(
 			prisma.foodInMeal.delete({
 				where: { id },
 			})
 		)

 		if (result.isFailure()) return failure(result.error)

 		return success(undefined)
 	}

 	// Real Log FoodLog CRUD (No historical macro snapshotting as requested)
 	async createLog(mealLogId: string, foodId: string, data: CreateFoodLogDTO): Promise<Result<FoodLogFull>> {
 		const result = await safeCall(
 			prisma.foodLog.create({
 				data: {
 					...data,
 					mealLogId: mealLogId,
 					foodId: foodId,
 				},
 				include: { food: true },
 			})
 		)

 		if (result.isFailure()) return failure(result.error)

 		return success(result.value)
 	}

 	async findAllLogs(mealLogId: string, userId: string): Promise<Result<FoodLogFull[]>> {
 		const result = await safeCall(
 			prisma.foodLog.findMany({
 				where: {
 					mealLogId: mealLogId,
 					mealLog: {
 						dietLog: {
 							userId: userId,
 						},
 					},
 				},
 				include: { food: true },
 			})
 		)
 		if (result.isFailure()) return failure(result.error)
 		return success(result.value)
 	}

 	async findLogById(id: string, userId: string): Promise<Result<FoodLogFull>> {
 		const result = await safeCall(
 			prisma.foodLog.findFirstOrThrow({
 				where: {
 					id: id,
 					mealLog: { dietLog: { userId: userId } },
 				},
 				include: { food: true },
 			})
 		)
 		if (result.isFailure()) return failure(result.error)

 		return success(result.value)
 	}

 	async updateLog(id: string, data: UpdateFoodLogDTO, _userId: string): Promise<Result<FoodLogFull>> {
 		const result = await safeCall(
 			prisma.foodLog.update({
 				where: { id },
 				data: data,
 				include: { food: true },
 			})
 		)
 		if (result.isFailure()) return failure(result.error)

 		return success(result.value)
 	}

 	async deleteLog(id: string, _userId: string): Promise<Result<void>> {
 		const result = await safeCall(
 			prisma.foodLog.delete({
 				where: { id },
 			})
 		)

 		if (result.isFailure()) return failure(result.error)

 		return success(undefined)
 	}
}
