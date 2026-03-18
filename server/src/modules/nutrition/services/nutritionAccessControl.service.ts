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
		return success(true)
	}

	async canManageGlobalFoods(user: authenticatedUser): Promise<Result<boolean>> {
		if (user.role === 'ADMIN') return success(true)

		return failure(this.ForbiddenError)
	}

	async canAccessDiet(dietId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessDiet(dietId, userId)

		this.handleAccessResult(result)

		return result
	}
	async canAccessMeal(dietId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessDiet(dietId, userId)

		this.handleAccessResult(result)

		return result
	}
	async canAccessFoodInMeal(dietId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessRepo.canAccessDiet(dietId, userId)

		this.handleAccessResult(result)

		return result
	}
}
