import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO, ExerciseFull } from '../schema/exercise.schema.js'
import { Result } from '@/@utils/result.js'

export interface IExerciseRepository {
	create(data: CreateExerciseDTO): Promise<Result<ExerciseFull>>
	update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseFull>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<ExerciseFull>>
	findAll(data: SearchExerciseDTO): Promise<Result<ExerciseFull[]>>
}
