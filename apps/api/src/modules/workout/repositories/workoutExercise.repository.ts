import { prisma, safeCall, type WorkoutExerciseFull } from '@ate-a-falha/database'
import {
	type Result,
	failure,
	success,
	type CreateWorkoutExerciseDTO,
	type UpdateWorkoutExerciseDTO,
} from '@ate-a-falha/shared'

import type { IWorkoutExerciseRepository } from '../interfaces/workoutExercise.interface.js'

export class WorkoutExerciseRepository implements IWorkoutExerciseRepository {
	async create(
		workoutId: string,
		exerciseId: string,
		data: CreateWorkoutExerciseDTO
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
	async update(id: string, data: UpdateWorkoutExerciseDTO, _userId: string): Promise<Result<WorkoutExerciseFull>> {
		const result = await safeCall(
 			prisma.workoutExercise.update({
 				where: { id },
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
 	async delete(id: string, _userId: string): Promise<Result<void>> {
 		const result = await safeCall(
 			prisma.workoutExercise.delete({
 				where: { id },
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
