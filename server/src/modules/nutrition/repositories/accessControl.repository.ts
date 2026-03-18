import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { failure, Result, success } from '@/@utils/result.js'
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

	async canACcessFoodInMeal(foodInMealId: string, userId: string): Promise<Result<boolean>> {
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
}
