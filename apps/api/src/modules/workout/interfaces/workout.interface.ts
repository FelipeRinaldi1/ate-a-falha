import { Result } from '@/@utils/result.js'
import { CreateWorkoutDTO, UpdateWorkoutDTO, WorkoutFull } from '../schema/workout.schema.js'

export interface IWorkoutRepository {
	create(planId: string, data: CreateWorkoutDTO, userId: string): Promise<Result<WorkoutFull>>
	update(id: string, data: UpdateWorkoutDTO, userId: string): Promise<Result<WorkoutFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(planId: string, userId: string): Promise<Result<WorkoutFull[]>>
	findById(id: string, userId: string): Promise<Result<WorkoutFull>>
}
