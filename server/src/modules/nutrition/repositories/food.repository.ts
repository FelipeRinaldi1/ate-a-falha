import { prisma } from '../../../infra/prisma.client'
import { safeCall } from '../../../infra/prisma.safeCall.js'
import { Result, success, failure } from '../../../utils/result.js'
import { IFoodRepository } from '../interfaces/food.interfaces.js'
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../DTOs/food.schema.js'
import { FoodEntity } from '../entities/food.entity.js'
import { FoodMapper } from '../mapper/food.mapper.js'

export class FoodRepository implements IFoodRepository {
	constructor() {}

	async create(data: createFoodDTO, userId?: string): Promise<Result<FoodEntity>> {
		const result = await safeCall(
			prisma.food.create({
				data: { ...data, userId },
			})
		)
		if (result.isFailure()) return result

		return success(FoodMapper.toEntity(result.value))
	}

	async findAll(data: foodSearchDTO, userId: string): Promise<Result<FoodEntity[]>> {
		const result = await safeCall(
			prisma.food.findMany({
				take: 10,
				skip: data.cursorId ? 1 : 0,
				cursor: data.cursorId ? { id: data.cursorId } : undefined,
				where: {
					userId,
					name: data.name ? { contains: data.name, mode: 'insensitive' } : undefined,
				},
				orderBy: [{ name: 'asc' }, { id: 'asc' }],
			})
		)

		if (result.isFailure()) return result

		const entities = result.value.map((food) => FoodMapper.toEntity(food))
		return success(entities)
	}

	async findById(id: string, userId: string): Promise<Result<FoodEntity>> {
		const result = await safeCall(
			prisma.food.findUniqueOrThrow({
				where: { id, userId },
			})
		)

		if (result.isFailure()) return result

		return success(FoodMapper.toEntity(result.value))
	}

	async update(id: string, data: updateFoodDTO, userId: string): Promise<Result<FoodEntity>> {
		const result = await safeCall(
			prisma.food.update({
				where: { id, userId },
				data: { ...data },
			})
		)

		if (result.isFailure()) return result

		return success(FoodMapper.toEntity(result.value))
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
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
