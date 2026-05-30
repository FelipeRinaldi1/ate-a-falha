import { safeCall, prisma, type MealFull, type MealLogFull } from '@ate-a-falha/database'
import {
	type Result,
	success,
	failure,
	type CreateMealDTO,
	type UpdateMealDTO,
	type CreateMealLogDTO,
	type UpdateMealLogDTO,
} from '@ate-a-falha/shared'
import { type IMealRepository, type IMealLogRepository } from '../interfaces/meal.interface.js'

export class MealRepository implements IMealRepository, IMealLogRepository {
	// Meal Plan CRUD
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

	// MealLog Real Consumption CRUD
	async createLog(dietLogId: string, data: CreateMealLogDTO): Promise<Result<MealLogFull>> {
		const result = await safeCall(
			prisma.mealLog.create({
				data: {
					...data,
					dietLog: { connect: { id: dietLogId } },
				},
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async updateLog(id: string, data: UpdateMealLogDTO, userId: string): Promise<Result<MealLogFull>> {
		const result = await safeCall(
			prisma.mealLog.update({
				where: {
					id: id,
					dietLog: { userId: userId },
				},
				data: data,
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async deleteLog(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.mealLog.delete({
				where: {
					id: id,
					dietLog: { userId: userId },
				},
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAllLogs(dietLogId: string, userId: string): Promise<Result<MealLogFull[]>> {
		const result = await safeCall(
			prisma.mealLog.findMany({
				where: {
					dietLogId: dietLogId,
					dietLog: { userId: userId },
				},
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findLogById(id: string, userId: string): Promise<Result<MealLogFull>> {
		const result = await safeCall(
			prisma.mealLog.findFirstOrThrow({
				where: {
					id,
					dietLog: { userId: userId },
				},
				include: { foods: { include: { food: true } } },
			})
		)

		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
