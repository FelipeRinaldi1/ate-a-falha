import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { Result, success, failure } from '@/@utils/result.js'
import { IWorkoutAccessControl } from '../interfaces/accessControl.interface.js'

export class WorkoutAccessControlRepository implements IWorkoutAccessControl {
	async canAccessSet(setId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.set.findFirstOrThrow({
				where: {
					id: setId,
					workoutExercise: { workout: { Plan: { userId: userId } } },
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
					workout: { Plan: { userId: userId } },
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
					Plan: { userId: userId },
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
