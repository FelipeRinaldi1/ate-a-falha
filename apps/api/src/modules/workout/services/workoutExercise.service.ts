import {
	type Result,
	failure,
	type CreateWorkoutExerciseDTO,
	type UpdateWorkoutExerciseDTO,
	type authenticatedUser,
} from '@ate-a-falha/shared'

import type { IWorkoutExerciseRepository } from '../interfaces/workoutExercise.interface.js'
import { WorkoutAccessControlService } from './accessControl.service.js'
import { type WorkoutExerciseFull } from '@ate-a-falha/database'

export class WorkoutExerciseService {
	constructor(
		private readonly workoutExerciseRepo: IWorkoutExerciseRepository,
		private readonly accessControl: WorkoutAccessControlService
	) {}

	async create(
		workoutId: string,
		data: CreateWorkoutExerciseDTO,
		authUser: authenticatedUser
	): Promise<Result<WorkoutExerciseFull>> {
		const access = await this.accessControl.canAccessWorkout(workoutId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.workoutExerciseRepo.create(workoutId, data.exerciseId, data, authUser.id)
		return result
	}

	async update(
		id: string,
		data: UpdateWorkoutExerciseDTO,
		authUser: authenticatedUser
	): Promise<Result<WorkoutExerciseFull>> {
		const access = await this.accessControl.canAccessWorkoutExercise(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.update(id, data, authUser.id)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessWorkoutExercise(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.delete(id, authUser.id)
	}

	async findAll(workoutId: string, authUser: authenticatedUser): Promise<Result<WorkoutExerciseFull[]>> {
		const access = await this.accessControl.canAccessWorkout(workoutId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.findAll(workoutId, authUser.id)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<WorkoutExerciseFull>> {
		const access = await this.accessControl.canAccessWorkoutExercise(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.findById(id, authUser.id)
	}
}
