import { FullWorkoutExerciseEntity } from './workoutExercise.entity.js'
export interface WorkoutEntity {
	id: string
	name?: string | null
	day: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
	planId: string
	createdAt: Date
	updatedAt: Date
}

export interface FullWorkoutEntity extends WorkoutEntity {
	workoutExercises?: FullWorkoutExerciseEntity[]
}
