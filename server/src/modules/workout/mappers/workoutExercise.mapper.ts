import { WorkoutExerciseEntity } from '../entities/workoutExercise.entity.js'
import { WorkoutExercise } from '@/generated/prisma/client.js'

export class WorkoutExerciseMapper {
	static toEntity(workoutExercise: WorkoutExercise): WorkoutExerciseEntity {
		return {
			id: workoutExercise.id,
			orderIndex: workoutExercise.orderIndex,
			workoutId: workoutExercise.workoutId,
			exerciseId: workoutExercise.exerciseId,
			createdAt: workoutExercise.createdAt,
			updatedAt: workoutExercise.updatedAt,
		}
	}
}
