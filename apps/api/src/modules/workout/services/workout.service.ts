import { Result, failure } from '@/@utils/result.js'
import { IWorkoutRepository } from '../interfaces/workout.interface.js'
import { WorkoutAccessControlService } from './accessControl.service.js'
import { CreateWorkoutDTO, UpdateWorkoutDTO, WorkoutFull } from '../schema/workout.schema.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'

export class WorkoutService {
	constructor(
		private workoutRepo: IWorkoutRepository,
		private accessControl: WorkoutAccessControlService
	) {}

	async create(planId: string, data: CreateWorkoutDTO, authUser: authenticatedUser): Promise<Result<WorkoutFull>> {
		const access = await this.accessControl.canAccessPlan(planId, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.workoutRepo.create(planId, data, authUser.id)
		return result
	}
	async update(id: string, data: UpdateWorkoutDTO, authUser: authenticatedUser): Promise<Result<WorkoutFull>> {
		const access = await this.accessControl.canAccessWorkout(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.workoutRepo.update(id, data, authUser.id)
		return result
	}
	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessWorkout(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.workoutRepo.delete(id, authUser.id)
		return result
	}
	async findAll(planId: string, authUser: authenticatedUser): Promise<Result<WorkoutFull[]>> {
		const access = await this.accessControl.canAccessPlan(planId, authUser.id)
		if (access.isFailure()) return failure(access.error)
		const result = await this.workoutRepo.findAll(planId, authUser.id)
		return result
	}
	async findById(id: string, authUser: authenticatedUser): Promise<Result<WorkoutFull>> {
		const access = await this.accessControl.canAccessWorkout(id, authUser.id)
		if (access.isFailure()) return failure(access.error)
		const result = await this.workoutRepo.findById(id, authUser.id)
		return result
	}
}
