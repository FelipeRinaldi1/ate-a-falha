import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { MealEntity } from '../entities/meal.entity.js'
import { Result, success, failure } from '@/@utils/result.js'
import { IMealRepository } from '../interfaces/meal.interface.js'
import { CreateMealDTO, UpdateMealDTO } from '../DTOs/meal.schema.js'
import { MealMapper } from '../mappers/meal.mapper.js'

export class MealRepository implements IMealRepository {
	async create(dietId: string, data: CreateMealDTO, userId: string): Promise<Result<MealEntity>> {
		const result = await safeCall(
			prisma.meal.create({
				data: {
					...data,
					diet: { connect: { uniqueId: { id: dietId, userId: userId } } },
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(MealMapper.toEntity(result.value))
	}

	async update(id: string, data: UpdateMealDTO, userId: string): Promise<Result<MealEntity>> {
		const result = await safeCall(
			prisma.meal.update({
				where: {
					id: id,
					diet: { userId: userId },
				},
				data: data,
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(MealMapper.toEntity(result.value))
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

	async findAll(dietId: string, userId: string): Promise<Result<MealEntity[]>> {
		const result = await safeCall(
			prisma.meal.findMany({
				where: {
					dietId: dietId,
					diet: { userId: userId },
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value.map((val) => MealMapper.toEntity(val)))
	}

	async findById(id: string, userId: string): Promise<Result<MealEntity>> {
		const result = await safeCall(
			prisma.meal.findFirstOrThrow({
				where: {
					id,
					diet: { userId: userId },
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(MealMapper.toEntity(result.value))
	}
}
