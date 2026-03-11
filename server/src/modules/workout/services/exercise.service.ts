import { IExerciseRepository } from '../interfaces/exercise.interface.js'
import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO } from '../DTOs/exercise.schema.js'
import { Result, success, failure } from '@/@utils/result.js'
import { ExerciseEntity } from '../entities/exercise.entity.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'

export class ExerciseService {
	constructor(private exerciseRepo: IExerciseRepository) {}

	async create(
		data: CreateExerciseDTO,
		authUser: authenticatedUser
	): Promise<Result<ExerciseEntity>> {
		if (authUser.role !== 'ADMIN') {
			return failure({
				type: 'FORBIDDEN',
				message: 'Acesso negado: Apenas administradores podem editar exercícios.',
			})
		}
		const result = await this.exerciseRepo.create(data)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async update(
		id: string,
		data: UpdateExerciseDTO,
		authUser: authenticatedUser
	): Promise<Result<ExerciseEntity>> {
		if (authUser.role !== 'ADMIN') {
			return failure({
				type: 'FORBIDDEN',
				message: 'Acesso negado: Apenas administradores podem editar exercícios.',
			})
		}
		const result = await this.exerciseRepo.update(id, data)

		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		if (authUser.role !== 'ADMIN') {
			return failure({
				type: 'FORBIDDEN',
				message: 'Acesso negado: Apenas administradores podem editar exercícios.',
			})
		}

		const result = await this.exerciseRepo.delete(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findAll(data: SearchExerciseDTO): Promise<Result<ExerciseEntity[]>> {
		const result = await this.exerciseRepo.findAll(data)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string): Promise<Result<ExerciseEntity>> {
		const result = await this.exerciseRepo.findById(id)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
