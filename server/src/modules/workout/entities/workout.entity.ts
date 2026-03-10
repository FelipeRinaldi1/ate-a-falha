import { WorkoutExerciseEntity } from './workoutExercise.entity.js'
export interface WorkoutEntity {
	id: string
	name?: string | null
	day: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
	PlanId: string
	workoutExercises?: WorkoutExerciseEntity[]
	createdAt: Date
	updatedAt: Date
}
