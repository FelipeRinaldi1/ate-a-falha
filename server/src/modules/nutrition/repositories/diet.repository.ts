import { IDietRepository } from '../interfaces/diet.interface.js'
import { Result, failure, success } from '@/@utils/result.js'
import { DietEntity } from '../entities/diet.entity.js'
import { CreateDietDTO, UpdateDietDTO } from '../DTOs/diet.schema.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { prisma } from '@/@infra/prisma.client.js'
import { DietMapper } from '../mappers/diet.mapper.js'

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
		if (result.isFailure()) return failure(result.error)

		return success(DietMapper.toEntity(result.value))
	}

	async update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietEntity>> {
		const result = await safeCall(
			prisma.diet.update({
				where: {
					uniqueId: { id, userId },
				},
				data: data,
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(DietMapper.toEntity(result.value))
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

	async findAll(userId: string): Promise<Result<DietEntity[]>> {
		const result = await safeCall(
			prisma.diet.findMany({
				where: {
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value.map((diet) => DietMapper.toEntity(diet)))
	}

	async findById(id: string, userId: string): Promise<Result<DietEntity>> {
		const result = await safeCall(
			prisma.diet.findUniqueOrThrow({
				where: {
					uniqueId: { id, userId },
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(DietMapper.toEntity(result.value))
	}
}
