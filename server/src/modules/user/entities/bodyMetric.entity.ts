export interface BodyMetricEntity {
	id: string
	weight: number
	height: number
	activityLevel: number
	bodyFat?: number | null
	muscleRate?: number | null
	userId: string
	createdAt: Date
	updatedAt: Date
}
