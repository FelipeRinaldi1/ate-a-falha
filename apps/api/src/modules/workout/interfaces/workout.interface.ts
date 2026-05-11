import { type Result, type CreateWorkoutDTO, type UpdateWorkoutDTO } from '@ate-a-falha/shared'
import { type WorkoutFull } from '@ate-a-falha/database'

export interface IWorkoutRepository {
	create(planId: string, data: CreateWorkoutDTO, userId: string): Promise<Result<WorkoutFull>>
	update(id: string, data: UpdateWorkoutDTO, userId: string): Promise<Result<WorkoutFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(planId: string, userId: string): Promise<Result<WorkoutFull[]>>
	findById(id: string, userId: string): Promise<Result<WorkoutFull>>
}
