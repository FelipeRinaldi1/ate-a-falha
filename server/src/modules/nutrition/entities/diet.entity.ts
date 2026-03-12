import { MealEntity } from './meal.enitity.js'
export interface DietEntity {
	id: string
	name: string
	dailyKcalGoal: number
	dailyProteinGoal: number
	dailyCarbGoal: number
	dailyFatGoal: number
	dailyWaterGoal: number
	userId: string
	meals?: MealEntity[]
	createdAt: Date
	updatedAt: Date
}
