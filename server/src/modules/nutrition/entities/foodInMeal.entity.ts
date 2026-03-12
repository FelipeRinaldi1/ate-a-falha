import { FoodEntity } from './food.entity.js'

export interface FoodInMealEntity {
	id: string
	quantity: number
	mealId: string
	foodId: string
	food?: FoodEntity
	createdAt: Date
	updatedAt: Date
}
