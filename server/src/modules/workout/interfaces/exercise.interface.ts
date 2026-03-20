import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO } from '../DTOs/exercise.schema.js'
import { ExerciseEntity } from '../entities/exercise.entity.js'
import { Result } from '@/@utils/result.js'

export interface IExerciseRepository {
	create(data: CreateExerciseDTO): Promise<Result<ExerciseEntity>>
	update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseEntity>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<ExerciseEntity>>
	findAll(data: SearchExerciseDTO): Promise<Result<ExerciseEntity[]>>
}
