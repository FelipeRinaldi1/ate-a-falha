import { Result } from '@/@utils/result.js'
import { FoodInMealEntity } from '../entities/foodInMeal.entity.js'
import { CreateFoodInMealDTO, UpdateFoodInMealDTO } from '../DTOs/foodInMeal.schema.js'

export interface IFoodInMealRepository {
	create(mealId: string, foodId: string, data: CreateFoodInMealDTO, userId: string): Promise<Result<FoodInMealEntity>>

	findAll(mealId: string, userId: string): Promise<Result<FoodInMealEntity[]>>

	findById(id: string, userId: string): Promise<Result<FoodInMealEntity>>

	update(id: string, data: UpdateFoodInMealDTO, userId: string): Promise<Result<FoodInMealEntity>>

	delete(id: string, userId: string): Promise<Result<void>>
}
