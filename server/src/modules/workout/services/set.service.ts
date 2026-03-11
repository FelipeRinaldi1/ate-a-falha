import { ISetRepository } from '../interfaces/set.interface.js'
import { IWorkoutExerciseRepository } from '../interfaces/workoutExercise.interface.js'
import { Result } from '@/@utils/result.js'
import { CreateSetDTO, UpdateSetDTO } from '../DTOs/set.schema.js'
import { SetEntity } from '../entities/set.entitiy.js'

export class SetService {
	constructor(
		private setRepository: ISetRepository,
		private workoutExerciseRepository: IWorkoutExerciseRepository
	) {}

	async createSet(
		data: CreateSetDTO,
		workoutExerciseId: string,
		userId: string
	): Promise<Result<SetEntity>> {
		const isOwner = await this.workoutExerciseRepository.checkOwnership(
			workoutExerciseId,
			userId
		)

		if (isOwner.isFailure()) {
			return isOwner
		}

		return await this.setRepository.create(data, workoutExerciseId)
	}

	async updateSet(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetEntity>> {
		return await this.setRepository.update(id, data, userId)
	}

	async deleteSet(id: string, userId: string): Promise<Result<void>> {
		return await this.setRepository.delete(id, userId)
	}

	async getAllSets(workoutExerciseId: string, userId: string): Promise<Result<SetEntity[]>> {
		return await this.setRepository.findAll(workoutExerciseId, userId)
	}

	async getSetById(id: string, userId: string): Promise<Result<SetEntity>> {
		return await this.setRepository.findById(id, userId)
	}
}
