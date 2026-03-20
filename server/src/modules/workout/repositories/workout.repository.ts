import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { Result, success, failure } from '@/@utils/result.js'
import { CreateWorkoutDTO, UpdateWorkoutDTO } from '@/modules/workout/DTOs/workout.schema.js'
import { WorkoutEntity } from '@/modules/workout/entities/workout.entity.js'
import { FullWorkoutEntity } from '@/modules/workout/entities/workout.entity.js'
import { IWorkoutInterface } from '@/modules/workout/interfaces/workout.interface.js'
import { WorkoutMapper } from '@/modules/workout/mappers/workout.mapper.js'

export class WorkoutRepository implements IWorkoutInterface {
	async create(planId: string, data: CreateWorkoutDTO, userId: string): Promise<Result<WorkoutEntity>> {
		const result = await safeCall(
			prisma.workout.create({
				data: {
					...data,
					Plan: { connect: { uniqueId: { id: planId, userId: userId } } },
				},
			})
		)
		return result
	}
	async update(id: string, data: UpdateWorkoutDTO, userId: string): Promise<Result<WorkoutEntity>> {
		const result = await safeCall(
			prisma.workout.update({
				where: {
					id: id,
					Plan: { userId: userId },
				},
				data: data,
			})
		)
		return result
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.workout.delete({
				where: { id: id, Plan: { userId: userId } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}
	async findAll(planId: string, userId: string): Promise<Result<WorkoutEntity[]>> {
		const result = await safeCall(
			prisma.workout.findMany({
				where: { PlanId: planId, Plan: { userId: userId } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		const entities = result.value.map((value) => WorkoutMapper.toEntity(value))
		return success(entities)
	}
	async findById(id: string, userId: string): Promise<Result<FullWorkoutEntity>> {
		const result = await safeCall(
			prisma.workout.findFirstOrThrow({
				where: {
					id: id,
					Plan: { userId: userId },
				},
			})
		)
		return result
	}
}
