import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { Result, failure, success } from '@/@utils/result.js'
import { IWorkoutExerciseRepository } from '../interfaces/workoutExercise.interface.js'
import { CreateWorkoutExerciseDTO, UpdateWorkoutExerciseDTO } from '../DTOs/workoutExercise.schema.js'
import { WorkoutExerciseEntity } from '../entities/workoutExercise.entity.js'
import { WorkoutExerciseMapper } from '../mappers/workoutExercise.mapper.js'

export class WorkoutExerciseRepository implements IWorkoutExerciseRepository {
	async create(
		workoutId: string,
		exerciseId: string,
		data: CreateWorkoutExerciseDTO,
		userId: string
	): Promise<Result<WorkoutExerciseEntity>> {
		const result = await safeCall(
			prisma.workoutExercise.create({
				data: {
					...data,
					workoutId: workoutId,
					exerciseId: exerciseId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(WorkoutExerciseMapper.toEntity(result.value))
	}
	async update(id: string, data: UpdateWorkoutExerciseDTO, userId: string): Promise<Result<WorkoutExerciseEntity>> {
		const result = await safeCall(
			prisma.workoutExercise.update({
				where: {
					id: id,
					workout: { Plan: { userId: userId } },
				},
				data: {
					...data,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(WorkoutExerciseMapper.toEntity(result.value))
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.workoutExercise.delete({
				where: {
					id: id,
					workout: { Plan: { userId: userId } },
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}
	async findAll(workoutId: string, userId: string): Promise<Result<WorkoutExerciseEntity[]>> {
		const result = await safeCall(
			prisma.workoutExercise.findMany({
				where: {
					workoutId: workoutId,
					workout: { Plan: { userId } },
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value.map((val) => WorkoutExerciseMapper.toEntity(val)))
	}
	async findById(id: string, userId: string): Promise<Result<WorkoutExerciseEntity>> {
		const result = await safeCall(
			prisma.workoutExercise.findFirstOrThrow({
				where: {
					id: id,
					workout: { Plan: { userId: userId } },
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
