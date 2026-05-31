import {
	type CreateExerciseDTO,
	type UpdateExerciseDTO,
	type SearchExerciseDTO,
	type Result,
} from '@ate-a-falha/shared'
import { type ExerciseFull } from '@ate-a-falha/database'

export interface IExerciseRepository {
	create(data: CreateExerciseDTO): Promise<Result<ExerciseFull>>
	update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseFull>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<ExerciseFull>>
	findAll(data: SearchExerciseDTO): Promise<Result<ExerciseFull[]>>
}
