import type { ISetRepository } from '../interfaces/set.interface.js'
import {
	failure,
	type Result,
	type CreateSetDTO,
	type UpdateSetDTO,
	type ReplaceSetsDTO,
	type authenticatedUser,
} from '@ate-a-falha/shared'
import { type SetFull } from '@ate-a-falha/database'
import { WorkoutAccessControlService } from './accessControl.service.js'

export class SetService {
	constructor(
		private readonly setRepository: ISetRepository,
		private readonly accessControlService: WorkoutAccessControlService
	) {}

	async create(
		data: CreateSetDTO,
		workoutExerciseId: string,
		authUser: authenticatedUser
	): Promise<Result<SetFull>> {
		const access = await this.accessControlService.canAccessWorkoutExercise(workoutExerciseId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.create(workoutExerciseId, data, authUser.id)
	}

	async update(id: string, data: UpdateSetDTO, authUser: authenticatedUser): Promise<Result<SetFull>> {
		const access = await this.accessControlService.canAccessSet(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.update(id, data, authUser.id)
	}

	async replaceAll(
		workoutExerciseId: string,
		data: ReplaceSetsDTO,
		authUser: authenticatedUser
	): Promise<Result<SetFull[]>> {
		const access = await this.accessControlService.canAccessWorkoutExercise(workoutExerciseId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.replaceAll(workoutExerciseId, data, authUser.id)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControlService.canAccessSet(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.delete(id, authUser.id)
	}

	async findAll(workoutExerciseId: string, authUser: authenticatedUser): Promise<Result<SetFull[]>> {
		const access = await this.accessControlService.canAccessWorkoutExercise(workoutExerciseId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.findAll(workoutExerciseId, authUser.id)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<SetFull>> {
		const access = await this.accessControlService.canAccessSet(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.setRepository.findById(id, authUser.id)
	}
}
