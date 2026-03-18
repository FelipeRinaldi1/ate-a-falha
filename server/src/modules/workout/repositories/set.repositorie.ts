import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { SetEntity } from '../entities/set.entitiy.js'
import { ISetRepository } from '../interfaces/set.interface.js'
import { failure, Result, success } from '@/@utils/result.js'
import { CreateSetDTO, UpdateSetDTO } from '../DTOs/set.schema.js'
import { SetMapper } from '../mappers/set.mapper.js'
export class SetRepository implements ISetRepository {
	private ownershipFilter(userId: string) {
		return {
			workoutExercise: { workout: { Plan: { userId: userId } } },
		}
	}

	async create(workoutExerciseId: string, data: CreateSetDTO): Promise<Result<SetEntity>> {
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

		return success(SetMapper.toEntity(result.value))
	}

	async update(id: string, data: UpdateSetDTO, userId: string): Promise<Result<SetEntity>> {
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

		return success(SetMapper.toEntity(result.value))
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

	async findAll(workoutExerciseId: string, userId: string): Promise<Result<SetEntity[]>> {
		const result = await safeCall(
			prisma.set.findMany({ where: { workoutExerciseId: workoutExerciseId, ...this.ownershipFilter(userId) } })
		)

		if (result.isFailure()) return failure(result.error)

		const entities = result.value.map((set) => SetMapper.toEntity(set))
		return success(entities)
	}

	async findById(id: string, userId: string): Promise<Result<SetEntity>> {
		const result = await safeCall(
			prisma.set.findUniqueOrThrow({
				where: { id: id, ...this.ownershipFilter(userId) },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(SetMapper.toEntity(result.value))
	}
}
