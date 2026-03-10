import { AppError } from '@/@utils/appError.js'
import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO } from '../DTOs/exercise.schema.js'
import { ExerciseEntity } from '../entities/exercise.entity.js'
import { Result } from '@/@utils/result.js'

export interface IExerciseRepository {
	create(data: CreateExerciseDTO): Promise<Result<ExerciseEntity | AppError>>
	update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseEntity | AppError>>
	delete(id: string): Promise<Result<void | AppError>>
	findById(id: string): Promise<Result<ExerciseEntity | AppError>>
	findAll(data: SearchExerciseDTO): Promise<Result<ExerciseEntity[] | AppError>>
}
