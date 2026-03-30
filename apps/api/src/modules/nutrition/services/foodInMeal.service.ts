import { authenticatedUser } from '@/@shared/authenticatedUser.js'
import { CreateFoodInMealDTO, UpdateFoodInMealDTO, FoodInMealFull } from '../schema/foodInMeal.schema.js'
import { IFoodInMealRepository } from '../interfaces/foodInMeal.interface.js'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'
import { failure, Result } from '@/@utils/result.js'

export class FoodInMealService {
	constructor(
		private foodInMealRepo: IFoodInMealRepository,
		private accessControl: NutritionAccessControlService
	) {}

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

	async update(
		id: string,
		data: UpdateFoodInMealDTO,
		authUser: authenticatedUser
	): Promise<Result<FoodInMealFull>> {
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
}
