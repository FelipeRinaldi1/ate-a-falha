import { Result } from '@/@utils/result.js'
import { CreateSetDTO, UpdateSetDTO, SetFull } from '../schema/set.schema.js'

export interface ISetRepository {
	create(workoutExerciseId: string, data: CreateSetDTO, userId: string): Promise<Result<SetFull>>
	update(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(workoutExerciseId: string, userId: string): Promise<Result<SetFull[]>>
	findById(id: string, userId: string): Promise<Result<SetFull>>
}
