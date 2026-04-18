import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { Result, success, failure } from '@ate-a-falha/shared'

import { IMealRepository } from '../interfaces/meal.interface.js'
import { CreateMealDTO, UpdateMealDTO } from '@ate-a-falha/shared'
import { MealFull } from '@ate-a-falha/database'

export class MealRepository implements IMealRepository {
	async create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealFull>> {
		const result = await safeCall(
			prisma.meal.create({
				data: {
					...data,
					diet: { connect: { uniqueId: { id: dietId, userId: userId } } },
				},
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealFull>> {
		const result = await safeCall(
			prisma.meal.update({
				where: {
					id: id,
					diet: { userId: userId },
				},
				data: data,
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.meal.delete({
				where: {
					id: id,
					diet: { userId: userId },
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(dietId: string, userId: string): Promise<Result<MealFull[]>> {
		const result = await safeCall(
			prisma.meal.findMany({
				where: {
					dietId: dietId,
					diet: { userId: userId },
				},
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<MealFull>> {
		const result = await safeCall(
			prisma.meal.findFirstOrThrow({
				where: {
					id,
					diet: { userId: userId },
				},
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
