import { FoodInMeal } from '@/generated/prisma/client.js'
import { FoodInMealEntity } from '../entities/foodInMeal.entity.js'

export class FoodInMealMapper {
	static toEntity(foodInMeal: FoodInMeal): FoodInMealEntity {
		return {
			id: foodInMeal.id,
			quantity: foodInMeal.quantity,
			mealId: foodInMeal.mealId,
			foodId: foodInMeal.foodId,
			createdAt: foodInMeal.createdAt,
			updatedAt: foodInMeal.updatedAt,
		}
	}
}
