import { FullWorkoutExerciseEntity } from './workoutExercise.entity.js'
export interface WorkoutEntity {
	id: string
	name?: string | null
	day: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
	PlanId: string
	createdAt: Date
	updatedAt: Date
}

export interface FullWorkoutEntity {
	id: string
	name?: string | null
	day: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
	PlanId: string
	workoutExercises?: FullWorkoutExerciseEntity[]
	createdAt: Date
	updatedAt: Date
}
