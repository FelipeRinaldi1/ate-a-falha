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
}
