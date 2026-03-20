export interface DietEntity {
	id: string
	name: string
	dailyKcalGoal: number
	dailyProteinGoal: number
	dailyCarbGoal: number
	dailyFatGoal: number
	dailyWaterGoal: number
	dailyWater: number
	userId: string
	createdAt: Date
	updatedAt: Date
}
