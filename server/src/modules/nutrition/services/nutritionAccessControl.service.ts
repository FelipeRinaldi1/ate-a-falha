import { Result, success, failure } from '@/@utils/result.js'
import { INutritionAccessControlRepository } from '../interfaces/accessControl.interface.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'
import { AppError } from '@/@utils/appError.js'

export class NutritionAccessControlService {
	constructor(private accessRepo: INutritionAccessControlRepository) {}

	private readonly ForbiddenError: AppError = {
		type: 'FORBIDDEN',
		message: 'Not found or not authorized',
	}

	private handleAccessResult(result: Result<boolean>): Result<boolean> {
		if (result.isFailure()) {
			if (result.error.type === 'NOT_FOUND') {
				return failure(this.ForbiddenError)
			}
			return failure(result.error)
		}

		if (result.value === false) {
			return failure(this.ForbiddenError)
		}

		return success(true)
	}

	async canManageGlobalFoods(user: authenticatedUser): Promise<Result<boolean>> {
		if (user.role === 'ADMIN') return success(true)
		return failure(this.ForbiddenError)
	}

	async canAccessDiet(dietId: string, user: authenticatedUser): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessDiet(dietId, user.id)
		return this.handleAccessResult(result)
	}

	async canAccessMeal(mealId: string, user: authenticatedUser): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessMeal(mealId, user.id)
		return this.handleAccessResult(result)
	}

	async canAccessFoodInMeal(foodInMealId: string, user: authenticatedUser): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessFoodInMeal(foodInMealId, user.id)
		return this.handleAccessResult(result)
	}

	async canAccessFood(foodId: string, user: authenticatedUser): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessFood(foodId, user.id)
		return this.handleAccessResult(result)
	}
}
