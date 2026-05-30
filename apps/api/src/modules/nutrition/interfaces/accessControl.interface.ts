import { type Result } from '@ate-a-falha/shared'

export interface INutritionAccessControlRepository {
	canAccessDiet(dietId: string, userId: string): Promise<Result<boolean>>
	canAccessMeal(mealId: string, userId: string): Promise<Result<boolean>>
	canAccessFoodInMeal(foodInMealId: string, userId: string): Promise<Result<boolean>>
	canAccessFood(foodId: string, userId: string): Promise<Result<boolean>>
	canAccessMealLog(mealLogId: string, userId: string): Promise<Result<boolean>>
	canAccessFoodLog(foodLogId: string, userId: string): Promise<Result<boolean>>
	canAccessDietLog(dietLogId: string, userId: string): Promise<Result<boolean>>
}
