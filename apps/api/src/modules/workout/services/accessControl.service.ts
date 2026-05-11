import { type AppError, type Result, failure, success, type authenticatedUser } from '@ate-a-falha/shared'
import type { IWorkoutAccessControl } from '../interfaces/accessControl.interface.js'

export class WorkoutAccessControlService {
	constructor(private readonly accessControlRepo: IWorkoutAccessControl) {}

	private readonly ForbiddenError: AppError = {
		type: 'FORBIDDEN',
		message: 'Not found or not authorized',
	}

	private handleAccessResult(result: Result<boolean>): Result<boolean> {
		if (result.isFailure()) {
			if (result.error.type === 'NOT_FOUND') {
				return failure(this.ForbiddenError)
			}
			return failure(result.error)
		}
		return success(true)
	}

	async canManageGlobalExercises(user: authenticatedUser): Promise<Result<boolean>> {
		if (user.role === 'ADMIN') return success(true)

		return failure(this.ForbiddenError)
	}

	async canAccessSet(setId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessControlRepo.canAccessSet(setId, userId)

		return this.handleAccessResult(result)
	}

	async canAccessWorkoutExercise(workoutExerciseId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessControlRepo.canAccessWorkoutExercise(workoutExerciseId, userId)

		return this.handleAccessResult(result)
	}

	async canAccessWorkout(workoutId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessControlRepo.canAccessWorkout(workoutId, userId)

		return this.handleAccessResult(result)
	}

	async canAccessPlan(planId: string, userId: string): Promise<Result<boolean>> {
		const result = await this.accessControlRepo.canAccessPlan(planId, userId)

		return this.handleAccessResult(result)
	}
}
