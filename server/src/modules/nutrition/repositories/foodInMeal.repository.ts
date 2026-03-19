import { prisma } from '@/@infra/prisma.client.js'
import { failure, Result, success } from '@/@utils/result.js'
import { IFoodInMealRepository } from '../interfaces/foodInMeal.interface.js'
import { CreateFoodInMealDTO, UpdateFoodInMealDTO } from '../DTOs/foodInMeal.schema.js'
import { FoodInMealEntity } from '../entities/foodInMeal.entity.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { FoodInMealMapper } from '../mappers/foodInMeal.mapper.js'

export class FoodInMealRepository implements IFoodInMealRepository {
	async create(mealId: string, foodId: string, data: CreateFoodInMealDTO): Promise<Result<FoodInMealEntity>> {
		const result = await safeCall(
			prisma.foodInMeal.create({
				data: {
					...data,
					mealId: mealId,
					foodId: foodId,
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(FoodInMealMapper.toEntity(result.value))
	}

	async findAll(mealId: string, userId: string): Promise<Result<FoodInMealEntity[]>> {
		const result = await safeCall(
			prisma.foodInMeal.findMany({
				where: {
					mealId: mealId,
					meal: {
						diet: {
							userId: userId,
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value.map((val) => FoodInMealMapper.toEntity(val)))
	}

	async findById(id: string, userId: string): Promise<Result<FoodInMealEntity>> {
		const result = await safeCall(
			prisma.foodInMeal.findFirstOrThrow({
				where: {
					id: id,
					meal: { diet: { userId: userId } },
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(FoodInMealMapper.toEntity(result.value))
	}

	async update(id: string, data: UpdateFoodInMealDTO, userId: string): Promise<Result<FoodInMealEntity>> {
		const result = await safeCall(
			prisma.foodInMeal.update({
				where: {
					id: id,
					meal: {
						diet: {
							userId: userId,
						},
					},
				},
				data: data,
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(FoodInMealMapper.toEntity(result.value))
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.foodInMeal.delete({
				where: {
					id: id,
					meal: {
						diet: {
							userId: userId,
						},
					},
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}
}
