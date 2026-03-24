import { Result } from '@/@utils/result.js'
import { WorkoutExerciseEntity } from '../entities/workoutExercise.entity.js'
import { CreateWorkoutExerciseDTO, UpdateWorkoutExerciseDTO } from '../DTOs/workoutExercise.schema.js'
export interface IWorkoutExerciseRepository {
	create(
		workoutId: string,
		exerciseId: string,
		data: CreateWorkoutExerciseDTO,
		userId: string
	): Promise<Result<WorkoutExerciseEntity>>
	update(id: string, data: UpdateWorkoutExerciseDTO, userId: string): Promise<Result<WorkoutExerciseEntity>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(workoutId: string, userId: string): Promise<Result<WorkoutExerciseEntity[]>>
	findById(id: string, userId: string): Promise<Result<WorkoutExerciseEntity>>
}
