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

function rankExercisesByTermRelevance<T extends { name: string }>(items: T[], term: string): T[] {
	const normalizedTerm = term.trim().toLowerCase()
	return [...items].sort((a, b) => {
		const aName = a.name.toLowerCase()
		const bName = b.name.toLowerCase()

		const aExact = aName === normalizedTerm ? 1 : 0
		const bExact = bName === normalizedTerm ? 1 : 0
		if (aExact !== bExact) return bExact - aExact

		const aStarts = aName.startsWith(normalizedTerm) ? 1 : 0
		const bStarts = bName.startsWith(normalizedTerm) ? 1 : 0
		if (aStarts !== bStarts) return bStarts - aStarts

		const aContains = aName.includes(normalizedTerm) ? 1 : 0
		const bContains = bName.includes(normalizedTerm) ? 1 : 0
		if (aContains !== bContains) return bContains - aContains

		return aName.localeCompare(bName)
	})
}

export class ExerciseRepository implements IExerciseRepository {
	async create(data: CreateExerciseDTO): Promise<Result<ExerciseFull>> {
		const result = await safeCall(
			prisma.exercise.create({
				data: data,
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
			const limit = Number(data.take || 10)
			const category = data.category ? data.category.toLowerCase() : null
			const muscle = data.primaryMuscles ? data.primaryMuscles.toLowerCase() : null
			const secondaryMuscle = data.secondaryMuscles ? data.secondaryMuscles.toLowerCase() : null
			const cursorId = data.cursorId ?? null

			const rawResult = await safeCall(
				prisma.$queryRawUnsafe<ExerciseFull[]>(
					`
					WITH ranked AS (
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
							similarity(e.name, $1::text) AS sim,
							(CASE WHEN e.name ILIKE $2::text THEN 1 ELSE 0 END) AS exact_match
						FROM "Exercise" e
						WHERE ($3::text IS NULL OR LOWER(e.category) = $3::text)
						  AND ($4::text IS NULL OR $4::text = ANY(e."primaryMuscles"))
						  AND ($6::text IS NULL OR $6::text = ANY(e."secondaryMuscles"))
						  AND (
						    e.name ILIKE $2::text
						    OR similarity(e.name, $1::text) > 0.32
						  )
					),
					cursor_row AS (
						SELECT exact_match, sim, name, id
						FROM ranked
						WHERE $7::text IS NOT NULL AND id = $7::text
						LIMIT 1
					)
					SELECT
						r.id,
						r."externalId",
						r.name,
						r."primaryMuscles",
						r."secondaryMuscles",
						r.instructions,
						r.category,
						r.images,
						r."createdAt",
						r."updatedAt"
					FROM ranked r
					LEFT JOIN cursor_row c ON TRUE
					WHERE c.id IS NULL
					   OR (
					     r.exact_match < c.exact_match
					     OR (r.exact_match = c.exact_match AND r.sim < c.sim)
					     OR (r.exact_match = c.exact_match AND r.sim = c.sim AND r.name > c.name)
					     OR (r.exact_match = c.exact_match AND r.sim = c.sim AND r.name = c.name AND r.id > c.id)
					   )
					ORDER BY
					  r.exact_match DESC,
					  r.sim DESC,
					  r.name ASC,
					  r.id ASC
					LIMIT $5::int;
					`,
					cleanTerm,
					pattern,
					category,
					muscle,
					limit,
					secondaryMuscle,
					cursorId
				)
			)

			if (rawResult.isSuccess()) {
				return success(rawResult.value)
			}

			// Fallback resiliente caso a extensão pg_trgm não esteja habilitada no banco de produção (ex: Render)
			const words = cleanTerm.split(/\s+/).filter(Boolean)
			const fallbackResult = await safeCall(
				prisma.exercise.findMany({
					take: Math.max(limit * 5, 200),
					where: {
						AND: [
							...words.map((word) => ({
								name: { contains: word, mode: 'insensitive' as const },
							})),
							data.category
								? {
										category: { equals: data.category, mode: 'insensitive' as const },
									}
								: {},
							data.primaryMuscles
								? {
										primaryMuscles: { has: data.primaryMuscles.toLowerCase() },
									}
								: {},
							data.secondaryMuscles
								? {
										secondaryMuscles: { has: data.secondaryMuscles.toLowerCase() },
									}
								: {},
						],
					},
					orderBy: [{ name: 'asc' }, { id: 'asc' }],
				})
			)

			if (fallbackResult.isFailure()) return fallbackResult
			const ranked = rankExercisesByTermRelevance(fallbackResult.value, cleanTerm)
			const startIndex = cursorId ? ranked.findIndex((item) => item.id === cursorId) + 1 : 0
			return success(ranked.slice(startIndex, startIndex + limit))
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
							data.secondaryMuscles ? { secondaryMuscles: { has: data.secondaryMuscles.toLowerCase() } } : {},
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
						data.secondaryMuscles
							? {
									secondaryMuscles: { has: data.secondaryMuscles.toLowerCase() },
								}
							: {},
					],
				},
				orderBy: data.random ? undefined : [{ name: 'asc' }, { id: 'asc' }],
			})
		)

		if (result.isFailure()) return result
		return success(result.value)
	}
	async findById(id: string): Promise<Result<ExerciseFull>> {
		const result = await safeCall(
			prisma.exercise.findUniqueOrThrow({
				where: { id: id },
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}
}
