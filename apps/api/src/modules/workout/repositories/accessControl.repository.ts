import { prisma, safeCall } from '@ate-a-falha/database'
import { type Result, success, failure } from '@ate-a-falha/shared'

import type { IWorkoutAccessControl } from '../interfaces/accessControl.interface.js'

export class WorkoutAccessControlRepository implements IWorkoutAccessControl {
	async canAccessSet(setId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.set.findFirstOrThrow({
				where: {
					id: setId,
					workoutExercise: { workout: { plan: { userId: userId } } },
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}

	async canAccessWorkoutExercise(workoutExerciseId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.workoutExercise.findFirstOrThrow({
				where: {
					id: workoutExerciseId,
					workout: { plan: { userId: userId } },
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}

	async canAccessWorkout(workoutId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.workout.findFirstOrThrow({
				where: {
					id: workoutId,
					plan: { userId: userId },
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}

	async canAccessPlan(planId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.plan.findFirstOrThrow({
				where: {
					id: planId,
					userId: userId,
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}
}
