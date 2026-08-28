import { prisma, safeCall, type ExerciseFull } from '@ate-a-falha/database'
import {
	type CreateExerciseDTO,
	type UpdateExerciseDTO,
	type SearchExerciseDTO,
	failure,
	type Result,
	success,
} from '@ate-a-falha/shared'

import type { IExerciseRepository } from '../interfaces/exercise.interface.js'

export class ExerciseRepository implements IExerciseRepository {
	async create(data: CreateExerciseDTO): Promise<Result<ExerciseFull>> {
		const result = await safeCall(
			prisma.exercise.create({
				data: data,
				include: { usedInWorkouts: true },
			})
		)

		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
	async update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseFull>> {
		const result = await safeCall(
			prisma.exercise.update({
				where: { id: id },
				data: data,
				include: { usedInWorkouts: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
	async delete(id: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.exercise.delete({
				where: { id: id },
			})
		)

		if (result.isFailure()) return failure(result.error)
		return success(undefined)
	}

	async findAll(data: SearchExerciseDTO): Promise<Result<ExerciseFull[]>> {
		if (data.name && data.name.trim().length > 0 && !data.random) {
			const cleanTerm = data.name.trim()
			const pattern = `%${cleanTerm}%`
			const limit = data.take || 10
			const category = data.category ? data.category.toLowerCase() : null
			const muscle = data.primaryMuscles ? data.primaryMuscles.toLowerCase() : null

			const rawResult = await safeCall(
				prisma.$queryRawUnsafe<ExerciseFull[]>(
					`
					SELECT 
						e.id,
						e."externalId",
						e.name,
						e."primaryMuscles",
						e."secondaryMuscles",
						e.instructions,
						e.category,
						e.images,
						e."createdAt",
						e."updatedAt",
						similarity(e.name, $1) AS sim,
						(CASE WHEN e.name ILIKE $2 THEN 1 ELSE 0 END) AS exact_match
					FROM "Exercise" e
					WHERE ($3::text IS NULL OR LOWER(e.category) = $3)
					  AND ($4::text IS NULL OR $4 = ANY(e."primaryMuscles"))
					  AND (
					    e.name ILIKE $2
					    OR similarity(e.name, $1) > 0.32
					  )
					ORDER BY 
					  exact_match DESC,
					  sim DESC,
					  e.name ASC
					LIMIT $5;
					`,
					cleanTerm,
					pattern,
					category,
					muscle,
					limit
				)
			)

			if (rawResult.isFailure()) return rawResult
			return success(rawResult.value)
		}

		let skip = data.cursorId ? 1 : 0

		if (data.random) {
			const countResult = await safeCall(
				prisma.exercise.count({
					where: {
						AND: [
							data.name ? { name: { contains: data.name, mode: 'insensitive' } } : {},
							data.category ? { category: { equals: data.category, mode: 'insensitive' } } : {},
							data.primaryMuscles ? { primaryMuscles: { has: data.primaryMuscles.toLowerCase() } } : {},
						],
					},
				})
			)
			if (countResult.isSuccess()) {
				const count = countResult.value
				const take = data.take || 10
				if (count > take) {
					skip = Math.floor(Math.random() * (count - take))
				}
			}
		}

		const result = await safeCall(
			prisma.exercise.findMany({
				take: data.take || 10,
				skip,
				cursor: data.cursorId && !data.random ? { id: data.cursorId } : undefined,
				where: {
					AND: [
						data.name
							? {
									name: { contains: data.name, mode: 'insensitive' },
								}
							: {},
						data.category
							? {
									category: { equals: data.category, mode: 'insensitive' },
								}
							: {},
						data.primaryMuscles
							? {
									primaryMuscles: { has: data.primaryMuscles.toLowerCase() },
								}
							: {},
					],
				},
				orderBy: data.random ? undefined : [{ name: 'asc' }, { id: 'asc' }],
				include: { usedInWorkouts: true },
			})
		)

		if (result.isFailure()) return result
		return success(result.value)
	}
	async findById(id: string): Promise<Result<ExerciseFull>> {
		const result = await safeCall(
			prisma.exercise.findUniqueOrThrow({
				where: { id: id },
				include: { usedInWorkouts: true },
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}
}
