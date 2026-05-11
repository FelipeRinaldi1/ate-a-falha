import type { ISetRepository } from '../interfaces/set.interface.js'
import { failure, type Result, type CreateSetDTO, type UpdateSetDTO } from '@ate-a-falha/shared'
import { type SetFull } from '@ate-a-falha/database'
import { WorkoutAccessControlService } from './accessControl.service.js'

export class SetService {
	constructor(
		private readonly setRepository: ISetRepository,
		private readonly acessControlService: WorkoutAccessControlService
	) {}

	async create(data: CreateSetDTO, workoutExerciseId: string, userId: string): Promise<Result<SetFull>> {
		const access = await this.acessControlService.canAccessWorkoutExercise(workoutExerciseId, userId)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.create(workoutExerciseId, data, userId)
	}

	async update(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetFull>> {
		const access = await this.acessControlService.canAccessSet(id, userId)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.update(id, data, userId)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const access = await this.acessControlService.canAccessSet(id, userId)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.delete(id, userId)
	}

	async findAll(workoutExerciseId: string, userId: string): Promise<Result<SetFull[]>> {
		const access = await this.acessControlService.canAccessWorkoutExercise(workoutExerciseId, userId)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.findAll(workoutExerciseId, userId)
	}

	async findById(id: string, userId: string): Promise<Result<SetFull>> {
		const access = await this.acessControlService.canAccessSet(id, userId)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.findById(id, userId)
	}
}
