import { SetEntity } from './set.entitiy.js'
import { ExerciseEntity } from './exercise.entity.js'
export interface WorkoutExerciseEntity {
	id: string
	orderIndex: number
	workoutId: string
	exerciseId: string
	exercise?: ExerciseEntity
	sets?: SetEntity[]
	createdAt: Date
	updatedAt: Date
}
