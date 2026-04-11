import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { failure, Result, success } from "@ate-a-falha/shared"

import { INutritionAccessControlRepository } from '../interfaces/accessControl.interface.js'

export class NutritionAccessControlRepository implements INutritionAccessControlRepository {
	async canAccessDiet(dietId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.diet.findUniqueOrThrow({
				where: {
					id: dietId,
					userId: userId,
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}

	async canAccessMeal(mealId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.meal.findFirstOrThrow({
				where: {
					id: mealId,
					diet: { userId: userId },
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}

	async canAccessFoodInMeal(foodInMealId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.foodInMeal.findFirstOrThrow({
				where: {
					id: foodInMealId,
					meal: { diet: { userId: userId } },
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}
	async canAccessFood(foodId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.food.findFirstOrThrow({
				where: {
					id: foodId,
					OR: [{ userId: userId }, { userId: null }],
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}
}
