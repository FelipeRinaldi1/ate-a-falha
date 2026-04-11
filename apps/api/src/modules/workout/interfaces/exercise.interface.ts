import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO } from "@ate-a-falha/shared"
import { ExerciseFull } from "@ate-a-falha/database"

import { Result } from "@ate-a-falha/shared"


export interface IExerciseRepository {
	create(data: CreateExerciseDTO): Promise<Result<ExerciseFull>>
	update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseFull>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<ExerciseFull>>
	findAll(data: SearchExerciseDTO): Promise<Result<ExerciseFull[]>>
}
