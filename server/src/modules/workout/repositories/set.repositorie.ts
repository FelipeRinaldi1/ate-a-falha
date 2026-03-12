import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { SetEntity } from '../entities/set.entitiy.js'
import { ISetRepository } from '../interfaces/set.interface.js'
import { failure, Result, success } from '@/@utils/result.js'
import { CreateSetDTO, UpdateSetDTO } from '../DTOs/set.schema.js'
import { SetMapper } from '../mappers/set.mapper.js'

export class SetRepository implements ISetRepository {
	async verifyOwnership(workoutExerciseId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.set.findFirstOrThrow({
				where: {
					workoutExerciseId: workoutExerciseId,
					workoutExercise: { workout: { Plan: { userId: userId } } },
				},
			})
		)
		if (result.isFailure()) return failure({ type: 'FORBIDDEN', message: 'Not found or not Authorized' })

		return success(true)
	}

	async create(workoutExerciseId: string, data: CreateSetDTO, userId: string): Promise<Result<SetEntity>> {
		const result = await safeCall(
			prisma.set.create({
				data: {
					...data,
					workoutExerciseId: workoutExerciseId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(SetMapper.toEntity(result.value))
	}

	async update(id: string, data: UpdateSetDTO, workoutExerciseId: string): Promise<Result<SetEntity>> {
		const result = await safeCall(
			prisma.set.update({
				where: {
					id: id,
					workoutExerciseId: workoutExerciseId,
				},
				data: {
					...data,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(SetMapper.toEntity(result.value))
	}

	async delete(id: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.set.delete({
				where: {
					id: id,
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(workoutExerciseId: string): Promise<Result<SetEntity[]>> {
		const result = await safeCall(prisma.set.findMany({ where: { workoutExerciseId: workoutExerciseId } }))

		if (result.isFailure()) return failure(result.error)

		const entities = result.value.map((set) => SetMapper.toEntity(set))
		return success(entities)
	}

	async findById(id: string): Promise<Result<SetEntity>> {
		const result = await safeCall(
			prisma.set.findUniqueOrThrow({
				where: { id: id },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
