import { Result, failure } from '@/@utils/result.js'
import { IWorkoutExerciseRepository } from '../interfaces/workoutExercise.interface.js'
import { WorkoutExerciseEntity } from '../entities/workoutExercise.entity.js'
import { WorkoutAccessControlService } from './accessControl.service.js'
import { CreateWorkoutExerciseDTO, UpdateWorkoutExerciseDTO } from '../DTOs/workoutExercise.schema.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'

export class WorkoutExerciseService {
	constructor(
		private workoutExerciseRepo: IWorkoutExerciseRepository,
		private accessControl: WorkoutAccessControlService
	) {}

	async create(
		workoutId: string,
		data: CreateWorkoutExerciseDTO,
		authUser: authenticatedUser
	): Promise<Result<WorkoutExerciseEntity>> {
		const access = await this.accessControl.canAccessWorkout(workoutId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.workoutExerciseRepo.create(workoutId, data.exerciseId, data, authUser.id)
		return result
	}

	async update(
		id: string,
		data: UpdateWorkoutExerciseDTO,
		authUser: authenticatedUser
	): Promise<Result<WorkoutExerciseEntity>> {
		const access = await this.accessControl.canAccessWorkoutExercise(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.update(id, data, authUser.id)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessWorkoutExercise(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.delete(id, authUser.id)
	}

	async findAll(workoutId: string, authUser: authenticatedUser): Promise<Result<WorkoutExerciseEntity[]>> {
		const access = await this.accessControl.canAccessWorkout(workoutId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.findAll(workoutId, authUser.id)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<WorkoutExerciseEntity>> {
		const access = await this.accessControl.canAccessWorkoutExercise(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		return await this.workoutExerciseRepo.findById(id, authUser.id)
	}
}
