import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { WorkoutFull } from '@ate-a-falha/database'
import { Result, success, failure } from "@ate-a-falha/shared"
import { CreateWorkoutDTO, UpdateWorkoutDTO } from '@ate-a-falha/shared'
import { IWorkoutRepository } from '../interfaces/workout.interface.js'
export class WorkoutRepository implements IWorkoutRepository {
	async create(planId: string, data: CreateWorkoutDTO, userId: string): Promise<Result<WorkoutFull>> {
		const result = await safeCall(
			prisma.workout.create({
				data: {
					...data,
					plan: { connect: { uniqueId: { id: planId, userId: userId } } },
				},
				include: {
					workoutExercises: {
						include: {
							sets: true,
							exercise: true,
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async update(id: string, data: UpdateWorkoutDTO, userId: string): Promise<Result<WorkoutFull>> {
		const result = await safeCall(
			prisma.workout.update({
				where: {
					id: id,
					plan: { userId: userId },
				},
				data: data,
				include: {
					workoutExercises: {
						include: {
							sets: true,
							exercise: true,
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.workout.delete({
				where: { id: id, plan: { userId: userId } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}
	async findAll(planId: string, userId: string): Promise<Result<WorkoutFull[]>> {
		const result = await safeCall(
			prisma.workout.findMany({
				where: { planId: planId, plan: { userId: userId } },
				include: {
					workoutExercises: {
						include: {
							sets: true,
							exercise: true,
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async findById(id: string, userId: string): Promise<Result<WorkoutFull>> {
		const result = await safeCall(
			prisma.workout.findFirstOrThrow({
				where: {
					id: id,
					plan: { userId: userId },
				},
				include: {
					workoutExercises: {
						include: {
							sets: true,
							exercise: true,
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
