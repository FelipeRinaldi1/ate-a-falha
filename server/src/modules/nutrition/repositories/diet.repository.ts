import { IDietRepository } from '../interfaces/diet.interface.js'
import { Result, failure, success } from '@/@utils/result.js'
import { DietEntity } from '../entities/diet.entity.js'
import { CreateDietDTO, UpdateDietDTO } from '../DTOs/diet.schema.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { prisma } from '@/@infra/prisma.client.js'

export class DietRepository implements IDietRepository {
	async create(data: CreateDietDTO, userId: string): Promise<Result<DietEntity>> {
		const result = await safeCall(
			prisma.diet.create({
				data: {
					...data,
					userId: userId,
				},
			})
		)
		return result
	}

	async update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietEntity>> {
		const result = await safeCall(
			prisma.diet.update({
				where: {
					id: id,
					userId: userId,
				},
				data: data,
			})
		)
		return result
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.diet.delete({
				where: {
					id: id,
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(userId: string): Promise<Result<DietEntity[]>> {
		const result = await safeCall(
			prisma.diet.findMany({
				where: {
					userId: userId,
				},
			})
		)
		return result
	}

	async findById(id: string, userId: string): Promise<Result<DietEntity>> {
		const result = await safeCall(
			prisma.diet.findUniqueOrThrow({
				where: {
					uniqueId: { id, userId },
				},
			})
		)
		return result
	}
}
