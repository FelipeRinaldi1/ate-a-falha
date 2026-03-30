import { Result } from '@/@utils/result.js'
import { CreateFoodInMealDTO, UpdateFoodInMealDTO, FoodInMealFull } from '../schema/foodInMeal.schema.js'

export interface IFoodInMealRepository {
	create(mealId: string, foodId: string, data: CreateFoodInMealDTO, userId: string): Promise<Result<FoodInMealFull>>

	findAll(mealId: string, userId: string): Promise<Result<FoodInMealFull[]>>

	findById(id: string, userId: string): Promise<Result<FoodInMealFull>>

	update(id: string, data: UpdateFoodInMealDTO, userId: string): Promise<Result<FoodInMealFull>>

	delete(id: string, userId: string): Promise<Result<void>>
}
