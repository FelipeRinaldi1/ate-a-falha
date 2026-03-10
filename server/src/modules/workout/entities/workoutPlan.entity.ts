import { WorkoutEntity } from './workout.entity.js'
export interface PlanEntity {
	id: string
	name: string
	isActive: boolean
	userId: string
	workouts?: WorkoutEntity[]
	createdAt: Date
	updatedAt: Date
}
