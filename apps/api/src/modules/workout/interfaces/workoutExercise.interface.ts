import { Result } from '@/@utils/result.js'
import { CreateWorkoutExerciseDTO, UpdateWorkoutExerciseDTO, WorkoutExerciseFull } from '../schema/workoutExercise.schema.js'
export interface IWorkoutExerciseRepository {
	create(
		workoutId: string,
		exerciseId: string,
		data: CreateWorkoutExerciseDTO,
		userId: string
	): Promise<Result<WorkoutExerciseFull>>
	update(id: string, data: UpdateWorkoutExerciseDTO, userId: string): Promise<Result<WorkoutExerciseFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(workoutId: string, userId: string): Promise<Result<WorkoutExerciseFull[]>>
	findById(id: string, userId: string): Promise<Result<WorkoutExerciseFull>>
}
