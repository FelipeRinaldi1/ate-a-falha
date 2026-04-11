import { IExerciseRepository } from '../interfaces/exercise.interface.js'
import { WorkoutAccessControlService } from './accessControl.service.js'
import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO } from "@ate-a-falha/shared"
import { ExerciseFull } from "@ate-a-falha/database"

import { Result, success, failure } from "@ate-a-falha/shared"

import { authenticatedUser } from "@ate-a-falha/shared"


export class ExerciseService {
	constructor(
		private exerciseRepo: IExerciseRepository,
		private accessControlService: WorkoutAccessControlService
	) {}

	async create(data: CreateExerciseDTO, authUser: authenticatedUser): Promise<Result<ExerciseFull>> {
		const access = await this.accessControlService.canManageGlobalExercises(authUser)
		if (access.isFailure()) return failure(access.error)

		const result = await this.exerciseRepo.create(data)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateExerciseDTO, authUser: authenticatedUser): Promise<Result<ExerciseFull>> {
		const access = await this.accessControlService.canManageGlobalExercises(authUser)
		if (access.isFailure()) return failure(access.error)

		const result = await this.exerciseRepo.update(id, data)

		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControlService.canManageGlobalExercises(authUser)
		if (access.isFailure()) return failure(access.error)

		const result = await this.exerciseRepo.delete(id)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findAll(data: SearchExerciseDTO): Promise<Result<ExerciseFull[]>> {
		const result = await this.exerciseRepo.findAll(data)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string): Promise<Result<ExerciseFull>> {
		const result = await this.exerciseRepo.findById(id)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
