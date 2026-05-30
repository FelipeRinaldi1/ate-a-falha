import {
	type authenticatedUser,
	type CreateMealDTO,
	type UpdateMealDTO,
	type CreateMealLogDTO,
	type UpdateMealLogDTO,
	type Result,
	failure,
} from '@ate-a-falha/shared'
import { type MealFull, type MealLogFull } from '@ate-a-falha/database'
import { type IMealRepository, type IMealLogRepository } from '../interfaces/meal.interface.js'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'

export class MealService {
	constructor(
		private readonly mealRepo: IMealRepository & IMealLogRepository,
		private readonly accessControl: NutritionAccessControlService
	) {}

	// Meal Plan CRUD
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

	async findById(id: string, authUser: authenticatedUser): Promise<Result<MealFull>> {
		const access = await this.accessControl.canAccessMeal(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.findById(id, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	// MealLog Real Consumption CRUD
	async createLog(
		dietLogId: string,
		data: CreateMealLogDTO,
		authUser: authenticatedUser
	): Promise<Result<MealLogFull>> {
		const access = await this.accessControl.canAccessDietLog(dietLogId, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.createLog(dietLogId, data)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async updateLog(id: string, data: UpdateMealLogDTO, authUser: authenticatedUser): Promise<Result<MealLogFull>> {
		const access = await this.accessControl.canAccessMealLog(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.updateLog(id, data, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async deleteLog(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessMealLog(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.deleteLog(id, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async findAllLogs(dietLogId: string, authUser: authenticatedUser): Promise<Result<MealLogFull[]>> {
		const access = await this.accessControl.canAccessDietLog(dietLogId, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.findAllLogs(dietLogId, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async findLogById(id: string, authUser: authenticatedUser): Promise<Result<MealLogFull>> {
		const access = await this.accessControl.canAccessMealLog(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const result = await this.mealRepo.findLogById(id, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}
}
