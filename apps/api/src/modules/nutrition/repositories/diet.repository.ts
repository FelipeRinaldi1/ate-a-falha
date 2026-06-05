import type { IDietRepository, IDietLogRepository } from '../interfaces/diet.interface.js'
import {
	type Result,
	failure,
	success,
	type CreateDietDTO,
	type UpdateDietDTO,
	type CreateDietLogDTO,
	type UpdateDietLogDTO,
} from '@ate-a-falha/shared'
import { safeCall, prisma, type DietFull, type DietLogFull } from '@ate-a-falha/database'

export class DietRepository implements IDietRepository, IDietLogRepository {
	// Diet Plan CRUD
	async create(data: CreateDietDTO, userId: string): Promise<Result<DietFull>> {
		const result = await safeCall(
			prisma.diet.create({
				data: {
					...data,
					userId: userId,
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietFull>> {
		const result = await safeCall(
			prisma.diet.update({
				where: {
					uniqueId: { id, userId },
				},
				data: data,
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.diet.delete({
				where: {
					uniqueId: { id, userId },
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(userId: string): Promise<Result<DietFull[]>> {
		const result = await safeCall(
			prisma.diet.findMany({
				where: {
					userId: userId,
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<DietFull>> {
		const result = await safeCall(
			prisma.diet.findUniqueOrThrow({
				where: {
					uniqueId: { id, userId },
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	// DietLog Real Consumption CRUD
	async createLog(data: CreateDietLogDTO, userId: string): Promise<Result<DietLogFull>> {
		const result = await safeCall(
			prisma.dietLog.create({
				data: {
					...data,
					userId: userId,
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async updateLog(id: string, data: UpdateDietLogDTO, userId: string): Promise<Result<DietLogFull>> {
		const result = await safeCall(
			prisma.dietLog.update({
				where: {
					id: id,
					userId: userId,
				},
				data: data,
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async deleteLog(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.dietLog.delete({
				where: {
					id: id,
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAllLogs(userId: string): Promise<Result<DietLogFull[]>> {
		const result = await safeCall(
			prisma.dietLog.findMany({
				where: {
					userId: userId,
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findLogById(id: string, userId: string): Promise<Result<DietLogFull>> {
		const result = await safeCall(
			prisma.dietLog.findFirstOrThrow({
				where: {
					id: id,
					userId: userId,
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findPublicById(id: string): Promise<Result<DietFull>> {
		const result = await safeCall(
			prisma.diet.findFirstOrThrow({
				where: {
					id: id,
					isExported: true,
				},
				include: { meals: { include: { foods: { include: { food: true } } } } },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async importDiet(targetDietId: string, userId: string): Promise<Result<DietFull>> {
		const targetResult = await this.findPublicById(targetDietId)
		if (targetResult.isFailure()) return failure(targetResult.error)
		const targetDiet = targetResult.value

		const importResult = await safeCall(
			prisma.$transaction(async (tx) => {
				const newDiet = await tx.diet.create({
					data: {
						name: `${targetDiet.name} (Importada)`,
						dailyKcalGoal: targetDiet.dailyKcalGoal,
						dailyProteinGoal: targetDiet.dailyProteinGoal,
						dailyCarbGoal: targetDiet.dailyCarbGoal,
						dailyFatGoal: targetDiet.dailyFatGoal,
						dailyFiberGoal: targetDiet.dailyFiberGoal,
						dailyWaterGoal: targetDiet.dailyWaterGoal,
						dailyWater: 0,
						userId: userId,
						isExported: false,
					},
				})

				for (const m of targetDiet.meals || []) {
					const newMeal = await tx.meal.create({
						data: {
							name: m.name,
							time: m.time,
							orderIndex: m.orderIndex,
							dietId: newDiet.id,
						},
					})

					for (const f of m.foods || []) {
						await tx.foodInMeal.create({
							data: {
								foodId: f.foodId,
								mealId: newMeal.id,
								quantity: f.quantity,
							},
						})
					}
				}

				return tx.diet.findUniqueOrThrow({
					where: { id: newDiet.id },
					include: { meals: { include: { foods: { include: { food: true } } } } },
				})
			})
		)

		if (importResult.isFailure()) return failure(importResult.error)
		return success(importResult.value)
	}
}
