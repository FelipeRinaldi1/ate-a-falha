import type { ISetRepository } from '../interfaces/set.interface.js'
import {
	failure,
	type Result,
	success,
	type CreateSetDTO,
	type UpdateSetDTO,
	type ReplaceSetsDTO,
} from '@ate-a-falha/shared'
import { prisma, safeCall, type SetFull } from '@ate-a-falha/database'

export class SetRepository implements ISetRepository {
	private ownershipFilter(userId: string) {
		return {
			workoutExercise: { workout: { plan: { userId: userId } } },
		}
	}

	async create(workoutExerciseId: string, data: CreateSetDTO, _userId: string): Promise<Result<SetFull>> {
		const result = await safeCall(
			prisma.$transaction(async (tx) => {
				let setNumber = data.setNumber
				if (setNumber === undefined) {
					const aggregate = await tx.set.aggregate({
						where: { workoutExerciseId },
						_max: { setNumber: true },
					})
					setNumber = (aggregate._max.setNumber ?? 0) + 1
				}

				return tx.set.create({
					data: {
						...data,
						weight: data.weight ?? null,
						workoutExerciseId,
						setNumber,
					},
				})
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateSetDTO, _userId: string): Promise<Result<SetFull>> {
		const result = await safeCall(
			prisma.set.update({
				where: { id },
				data: {
					...data,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async replaceAll(workoutExerciseId: string, data: ReplaceSetsDTO, _userId: string): Promise<Result<SetFull[]>> {
		const result = await safeCall(
			prisma.$transaction(async (tx) => {
				await tx.set.deleteMany({
					where: { workoutExerciseId },
				})

				if (data.sets.length === 0) return []

				await tx.set.createMany({
					data: data.sets.map((set, index) => ({
						workoutExerciseId,
						setNumber: set.setNumber ?? index + 1,
						repetitions: set.repetitions,
						weight: set.weight ?? null,
						restTimeSeconds: set.restTimeSeconds,
					})),
				})

				return tx.set.findMany({
					where: { workoutExerciseId },
					orderBy: { setNumber: 'asc' },
				})
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async delete(id: string, _userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.$transaction(async (tx) => {
				const deleted = await tx.set.delete({
					where: { id },
					select: { workoutExerciseId: true },
				})

				const remaining = await tx.set.findMany({
					where: { workoutExerciseId: deleted.workoutExerciseId },
					orderBy: [{ setNumber: 'asc' }, { createdAt: 'asc' }],
					select: { id: true, setNumber: true },
				})

				for (let i = 0; i < remaining.length; i++) {
					const item = remaining[i]!
					if (item.setNumber !== i + 1) {
						await tx.set.update({
							where: { id: item.id },
							data: { setNumber: i + 1 },
						})
					}
				}
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(workoutExerciseId: string, userId: string): Promise<Result<SetFull[]>> {
		const result = await safeCall(
			prisma.set.findMany({
				where: { workoutExerciseId: workoutExerciseId, ...this.ownershipFilter(userId) },
				orderBy: { setNumber: 'asc' },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<SetFull>> {
		const result = await safeCall(
			prisma.set.findFirstOrThrow({
				where: { id: id, ...this.ownershipFilter(userId) },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
