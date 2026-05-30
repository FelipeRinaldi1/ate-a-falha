import {
	type authenticatedUser,
	type CreateFoodInMealDTO,
	type UpdateFoodInMealDTO,
	type CreateFoodLogDTO,
	type UpdateFoodLogDTO,
	failure,
	Result,
} from '@ate-a-falha/shared'
import { type FoodInMealFull, type FoodLogFull } from '@ate-a-falha/database'

import type { IFoodInMealRepository, IFoodLogRepository } from '../interfaces/foodInMeal.interface.js'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'

export class FoodInMealService {
	constructor(
		private readonly foodInMealRepo: IFoodInMealRepository & IFoodLogRepository,
		private readonly accessControl: NutritionAccessControlService
	) {}

	// FoodInMeal Plan CRUD
	async create(
		mealId: string,
		foodId: string,
		data: CreateFoodInMealDTO,
		authUser: authenticatedUser
	): Promise<Result<FoodInMealFull>> {
		const validation = await Promise.all([
			this.accessControl.canAccessMeal(mealId, authUser),
			this.accessControl.canAccessFood(foodId, authUser),
		])

		const access = Result.combine(validation)

		if (access.isFailure()) return failure(access.error)

		const result = await this.foodInMealRepo.create(mealId, foodId, data, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async update(id: string, data: UpdateFoodInMealDTO, authUser: authenticatedUser): Promise<Result<FoodInMealFull>> {
		const access = await this.accessControl.canAccessFoodInMeal(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.update(id, data, authUser.id)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessFoodInMeal(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.delete(id, authUser.id)
	}

	async findAll(mealId: string, authUser: authenticatedUser): Promise<Result<FoodInMealFull[]>> {
		const access = await this.accessControl.canAccessMeal(mealId, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.findAll(mealId, authUser.id)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<FoodInMealFull>> {
		const access = await this.accessControl.canAccessFoodInMeal(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.findById(id, authUser.id)
	}

	// FoodLog Real Consumption CRUD
	async createLog(
		mealLogId: string,
		foodId: string,
		data: CreateFoodLogDTO,
		authUser: authenticatedUser
	): Promise<Result<FoodLogFull>> {
		const validation = await Promise.all([
			this.accessControl.canAccessMealLog(mealLogId, authUser),
			this.accessControl.canAccessFood(foodId, authUser),
		])

		const access = Result.combine(validation)

		if (access.isFailure()) return failure(access.error)

		const result = await this.foodInMealRepo.createLog(mealLogId, foodId, data, authUser.id)

		if (result.isFailure()) return failure(result.error)

		return result
	}

	async updateLog(id: string, data: UpdateFoodLogDTO, authUser: authenticatedUser): Promise<Result<FoodLogFull>> {
		const access = await this.accessControl.canAccessFoodLog(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.updateLog(id, data, authUser.id)
	}

	async deleteLog(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessFoodLog(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.deleteLog(id, authUser.id)
	}

	async findAllLogs(mealLogId: string, authUser: authenticatedUser): Promise<Result<FoodLogFull[]>> {
		const access = await this.accessControl.canAccessMealLog(mealLogId, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.findAllLogs(mealLogId, authUser.id)
	}

	async findLogById(id: string, authUser: authenticatedUser): Promise<Result<FoodLogFull>> {
		const access = await this.accessControl.canAccessFoodLog(id, authUser)
		if (access.isFailure()) return failure(access.error)

		return await this.foodInMealRepo.findLogById(id, authUser.id)
	}
}
