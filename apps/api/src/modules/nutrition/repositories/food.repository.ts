import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { Result, success, failure } from "@ate-a-falha/shared"

import { IFoodRepository } from '../interfaces/food.interfaces.js'
import { CreateFoodDTO, FoodSearchDTO, UpdateFoodDTO } from "@ate-a-falha/shared"
import { FoodFull } from "@ate-a-falha/database"


export class FoodRepository implements IFoodRepository {
	async create(data: CreateFoodDTO, userId?: string): Promise<Result<FoodFull>> {
		const result = await safeCall(
			prisma.food.create({
				data: { ...data, userId },
				include: { foodInMeals: true }
			})
		)
		if (result.isFailure()) return result

		return success(result.value)
	}

	async findAll(data: FoodSearchDTO, userId?: string): Promise<Result<FoodFull[]>> {
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
						data.name
							? {
									name: { contains: data.name, mode: 'insensitive' },
								}
							: {},
					],
				},
				orderBy: [{ name: 'asc' }, { id: 'asc' }],
				include: { foodInMeals: true }
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}

	async findById(id: string, userId?: string): Promise<Result<FoodFull>> {
		const result = await safeCall(
			prisma.food.findUniqueOrThrow({
				where: { id, userId },
				include: { foodInMeals: true }
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}

	async update(id: string, data: UpdateFoodDTO, userId?: string): Promise<Result<FoodFull>> {
		const result = await safeCall(
			prisma.food.update({
				where: { id, userId },
				data: { ...data },
				include: { foodInMeals: true }
			})
		)

		if (result.isFailure()) return result

		return success(result.value)
	}

	async delete(id: string, userId?: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.food.delete({
				where: { id, userId },
			})
		)

		if (result.isFailure()) {
			return failure(result.error)
		}

		return success(undefined)
	}
}
