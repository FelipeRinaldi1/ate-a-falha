import { prisma } from '@/@infra/prisma.client.js'
import { failure, Result, success } from '@/@utils/result.js'
import { IFoodInMealRepository } from '../interfaces/foodInMeal.interface.js'
import { CreateFoodInMealDTO, UpdateFoodInMealDTO, FoodInMealFull } from '../schema/foodInMeal.schema.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'

export class FoodInMealRepository implements IFoodInMealRepository {
	async create(mealId: string, foodId: string, data: CreateFoodInMealDTO): Promise<Result<FoodInMealFull>> {
		const result = await safeCall(
			prisma.foodInMeal.create({
				data: {
					...data,
					mealId: mealId,
					foodId: foodId,
				},
				include: { food: true }
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
				include: { food: true }
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
				include: { food: true }
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateFoodInMealDTO, userId: string): Promise<Result<FoodInMealFull>> {
		const result = await safeCall(
			prisma.foodInMeal.update({
				where: {
					id: id,
					meal: {
						diet: {
							userId: userId,
						},
					},
				},
				data: data,
				include: { food: true }
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.foodInMeal.delete({
				where: {
					id: id,
					meal: {
						diet: {
							userId: userId,
						},
					},
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}
}
