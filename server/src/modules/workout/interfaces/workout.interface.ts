import { Result } from '@/@utils/result.js'
import { WorkoutEntity } from '../entities/workout.entity.js'
import { CreateWorkoutDTO, UpdateWorkoutDTO } from '../DTOs/workout.schema.js'

export interface IWorkoutInterface {
	create(planId: string, data: CreateWorkoutDTO, userId: string): Promise<Result<WorkoutEntity>>
	update(id: string, data: UpdateWorkoutDTO, userId: string): Promise<Result<WorkoutEntity>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(planId: string, userId: string): Promise<Result<WorkoutEntity[]>>
	findById(id: string, userId: string): Promise<Result<WorkoutEntity>>
}
