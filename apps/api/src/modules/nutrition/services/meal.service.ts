import { type authenticatedUser, type CreateMealDTO, type UpdateMealDTO, type Result, failure } from '@ate-a-falha/shared'
import { type MealFull } from '@ate-a-falha/database'
import { MealRepository } from '../repositories/meal.repository.js'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'

export class MealService {
	constructor(
		private readonly mealRepo: MealRepository,
		private readonly accessControl: NutritionAccessControlService
	) {}
	async create(dietId: string, data: CreateMealDTO, authUser: authenticatedUser): Promise<Result<MealFull>> {
		const access = await this.accessControl.canAccessDiet(dietId, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.create(dietId, data, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async update(id: string, data: UpdateMealDTO, authUser: authenticatedUser): Promise<Result<MealFull>> {
		const access = await this.accessControl.canAccessMeal(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.update(id, data, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessMeal(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.delete(id, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async findAll(dietId: string, authUser: authenticatedUser): Promise<Result<MealFull[]>> {
		const access = await this.accessControl.canAccessDiet(dietId, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.findAll(dietId, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async findById(id: string, authUser: authenticatedUser) {
		const access = await this.accessControl.canAccessMeal(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.findById(id, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}
}
