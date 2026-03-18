import { SetEntity } from '../entities/set.entitiy.js'
import { Result } from '@/@utils/result.js'
import { CreateSetDTO, UpdateSetDTO } from '../DTOs/set.schema.js'

export interface ISetRepository {
	create(workoutExerciseId: string, data: CreateSetDTO, userId: string): Promise<Result<SetEntity>>
	update(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetEntity>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(workoutExerciseId: string, userId: string): Promise<Result<SetEntity[]>>
	findById(id: string, userId: string): Promise<Result<SetEntity>>
}
