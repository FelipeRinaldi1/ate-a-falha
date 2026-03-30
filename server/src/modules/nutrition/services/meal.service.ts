import { NutritionAccessControlService } from './nutritionAccessControl.service.js'
import { Result, failure } from '@/@utils/result.js'
import { MealRepository } from '../repositories/meal.repository.js'
import { CreateMealDTO, UpdateMealDTO, MealFull } from '../schema/meal.schema.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'

export class MealService {
	constructor(
		private mealRepo: MealRepository,
		private accessControl: NutritionAccessControlService
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
