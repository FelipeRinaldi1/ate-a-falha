import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { Result, failure, success } from '@/@utils/result.js'
import { IWorkoutExerciseRepository } from '../interfaces/workoutExercise.interface.js'
import { CreateWorkoutExerciseDTO, UpdateWorkoutExerciseDTO, WorkoutExerciseFull } from '../schema/workoutExercise.schema.js'

export class WorkoutExerciseRepository implements IWorkoutExerciseRepository {
	async create(
		workoutId: string,
		exerciseId: string,
		data: CreateWorkoutExerciseDTO,
	): Promise<Result<WorkoutExerciseFull>> {
		const result = await safeCall(
			prisma.workoutExercise.create({
				data: {
					...data,
					workoutId: workoutId,
					exerciseId: exerciseId,
				},
				include: {
					sets: true,
					exercise: true,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async update(id: string, data: UpdateWorkoutExerciseDTO, userId: string): Promise<Result<WorkoutExerciseFull>> {
		const result = await safeCall(
			prisma.workoutExercise.update({
				where: {
					id: id,
					workout: { plan: { userId: userId } },
				},
				data: {
					...data,
				},
				include: {
					sets: true,
					exercise: true,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.workoutExercise.delete({
				where: {
					id: id,
					workout: { plan: { userId: userId } },
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}
	async findAll(workoutId: string, userId: string): Promise<Result<WorkoutExerciseFull[]>> {
		const result = await safeCall(
			prisma.workoutExercise.findMany({
				where: {
					workoutId: workoutId,
					workout: { plan: { userId } },
				},
				include: {
					sets: true,
					exercise: true,
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async findById(id: string, userId: string): Promise<Result<WorkoutExerciseFull>> {
		const result = await safeCall(
			prisma.workoutExercise.findFirstOrThrow({
				where: {
					id: id,
					workout: { plan: { userId: userId } },
				},
				include: {
					sets: true,
					exercise: true,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
