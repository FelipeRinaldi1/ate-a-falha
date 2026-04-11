import { Result } from "@ate-a-falha/shared"

import { CreateWorkoutExerciseDTO, UpdateWorkoutExerciseDTO } from "@ate-a-falha/shared"
import { WorkoutExerciseFull } from "@ate-a-falha/database"

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
