import { ISetRepository } from '../interfaces/set.interface.js'
import { failure, Result, success } from '@ate-a-falha/shared'

import { CreateSetDTO, UpdateSetDTO } from '@ate-a-falha/shared'
import { SetFull } from '@ate-a-falha/database'

import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'

export class SetRepository implements ISetRepository {
	private ownershipFilter(userId: string) {
		return {
			workoutExercise: { workout: { plan: { userId: userId } } },
		}
	}

	async create(workoutExerciseId: string, data: CreateSetDTO): Promise<Result<SetFull>> {
		const count = await prisma.set.count({ where: { workoutExerciseId: workoutExerciseId } })

		const result = await safeCall(
			prisma.set.create({
				data: {
					...data,
					workoutExerciseId: workoutExerciseId,
					setNumber: count + 1,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetFull>> {
		const result = await safeCall(
			prisma.set.update({
				where: {
					id: id,
					...this.ownershipFilter(userId),
				},
				data: {
					...data,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.set.delete({
				where: {
					id: id,
					...this.ownershipFilter(userId),
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(workoutExerciseId: string, userId: string): Promise<Result<SetFull[]>> {
		const result = await safeCall(
			prisma.set.findMany({ where: { workoutExerciseId: workoutExerciseId, ...this.ownershipFilter(userId) } })
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<SetFull>> {
		const result = await safeCall(
			prisma.set.findUniqueOrThrow({
				where: { id: id, ...this.ownershipFilter(userId) },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
