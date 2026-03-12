import { FoodInMealEntity } from './foodInMeal.entity.js'

export interface MealEntity {
	id: string
	name: string
	time: string
	orderIndex: number
	dietId: string
	foods?: FoodInMealEntity[]
	createdAt: Date
	updatedAt: Date
}
