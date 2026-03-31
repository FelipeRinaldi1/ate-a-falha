import { ISetRepository } from '../interfaces/set.interface.js'
import { failure, Result } from "@ate-a-falha/shared"

import { CreateSetDTO, UpdateSetDTO } from "@ate-a-falha/shared"
import { SetFull } from "@ate-a-falha/database"

import { WorkoutAccessControlService } from './accessControl.service.js'

export class SetService {
	constructor(
		private setRepository: ISetRepository,
		private acessControlService: WorkoutAccessControlService
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
