import { Result } from '@ate-a-falha/shared'

import { CreateSetDTO, UpdateSetDTO } from '@ate-a-falha/shared'
import { SetFull } from '@ate-a-falha/database'

export interface ISetRepository {
	create(workoutExerciseId: string, data: CreateSetDTO, userId: string): Promise<Result<SetFull>>
	update(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(workoutExerciseId: string, userId: string): Promise<Result<SetFull[]>>
	findById(id: string, userId: string): Promise<Result<SetFull>>
}
