import { prisma, safeCall } from '@ate-a-falha/database'
import { IFoodRepository } from '../interfaces/food.interfaces.js'
import { Result, success, failure } from '@ate-a-falha/shared'
import type { CreateFoodDTO, FoodSearchDTO, UpdateFoodDTO } from '@ate-a-falha/shared'
import type { FoodFull } from '@ate-a-falha/database'

export class FoodRepository implements IFoodRepository {
	async create(data: CreateFoodDTO, userId?: string): Promise<Result<FoodFull>> {
		const result = await safeCall(
			prisma.food.create({
				data: { ...data, calories: data.calories as number, userId: userId ?? null },
				include: { foodInMeals: true },
			})
		)
		if (result.isFailure()) return result

		return success(result.value)
	}

	async findAll(data: FoodSearchDTO, userId?: string): Promise<Result<FoodFull[]>> {
		if (data.name && data.name.trim().length > 0) {
			const cleanTerm = data.name.trim()
			const pattern = `%${cleanTerm}%`
			const limit = data.take || 20

			const rawResult = await safeCall(
				prisma.$queryRawUnsafe<FoodFull[]>(
					`
					SELECT 
						f.id,
						f.name,
						f.calories,
						f.carbohydrate,
						f.protein,
						f.lipids,
						f.fiber,
						f."userId",
						f."createdAt",
						f."updatedAt",
						similarity(f.name, $1) AS sim,
						(CASE WHEN f.name ILIKE $2 THEN 1 ELSE 0 END) AS exact_match
					FROM "Food" f
					WHERE ($3::text IS NULL OR f."userId" = $3 OR f."userId" IS NULL)
					  AND (
					    f.name ILIKE $2
					    OR similarity(f.name, $1) > 0.3
					  )
					ORDER BY 
					  exact_match DESC,
					  sim DESC,
					  f.name ASC
					LIMIT $4;
					`,
					cleanTerm,
					pattern,
					userId ?? null,
					limit
				)
			)

			if (rawResult.isFailure()) return rawResult
			return success(rawResult.value)
		}

		const result = await safeCall(
			prisma.food.findMany({
				take: data.take || 10,
				skip: data.cursorId ? 1 : 0,
				cursor: data.cursorId ? { id: data.cursorId } : undefined,
				where: {
					AND: [
						userId
							? {
									OR: [{ userId: userId }, { userId: null }],
								}
							: {},
					],
				},
				orderBy: [{ name: 'asc' }, { id: 'asc' }],
				include: { foodInMeals: true },
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}

	async findById(id: string, _userId?: string): Promise<Result<FoodFull>> {
		const result = await safeCall(
			prisma.food.findUniqueOrThrow({
				where: { id },
				include: { foodInMeals: true },
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}

	async update(id: string, data: UpdateFoodDTO, userId?: string): Promise<Result<FoodFull>> {
		const result = await safeCall(
			prisma.food.update({
				where: userId ? { id_userId: { id, userId } } : { id },
				data: { ...data },
				include: { foodInMeals: true },
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}

	async delete(id: string, userId?: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.food.delete({
				where: userId ? { id_userId: { id, userId } } : { id },
			})
		)

		if (result.isFailure()) {
			return failure(result.error)
		}

		return success(undefined)
	}
}
