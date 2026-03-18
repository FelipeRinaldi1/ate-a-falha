import { Result } from '@/@utils/result.js'

export interface INutritionAccessControlRepository {
	canAccessDiet(dietId: string, userId: string): Promise<Result<boolean>>
	canAccessMeal(mealId: string, userId: string): Promise<Result<boolean>>
	canACcessFoodInMeal(foodInMealId: string, userId: string): Promise<Result<boolean>>
}
