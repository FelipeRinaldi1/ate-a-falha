import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { Result, success, failure } from '@/@utils/result.js'
import { IBodyMetricRepository } from '../interfaces/bodyMetric.interface.js'
import { createBodyMetricDTO, bodyMetricSearchDTO, updateBodyMetricDTO } from '../DTOs/bodyMetric.schema.js'
import { BodyMetricEntity } from '../entities/bodyMetric.entity.js'
import { BodyMetricMapper } from '../mappers/bodyMetric.mapper.js'

export class BodyMetricRepository implements IBodyMetricRepository {
	async create(data: createBodyMetricDTO, userId: string): Promise<Result<BodyMetricEntity>> {
		const result = await safeCall(
			prisma.bodyMetric.create({
				data: { ...data, userId },
			})
		)
		if (result.isFailure()) return result

		return success(BodyMetricMapper.toEntity(result.value))
	}

	async findAll(data: bodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricEntity[]>> {
		const result = await safeCall(
			prisma.bodyMetric.findMany({
				take: data.take || 10,
				skip: data.cursorId ? 1 : 0,
				cursor: data.cursorId ? { id: data.cursorId } : undefined,
				where: {
					userId: userId,
				},
				orderBy: { createdAt: 'desc' },
			})
		)

		if (result.isFailure()) return result

		const entities = result.value.map((metric) => BodyMetricMapper.toEntity(metric))
		return success(entities)
	}

	async findById(id: string, userId: string): Promise<Result<BodyMetricEntity>> {
		const result = await safeCall(
			prisma.bodyMetric.findUniqueOrThrow({
				where: { id, userId },
			})
		)

		if (result.isFailure()) return result

		return success(BodyMetricMapper.toEntity(result.value))
	}

	async update(id: string, data: updateBodyMetricDTO, userId: string): Promise<Result<BodyMetricEntity>> {
		const result = await safeCall(
			prisma.bodyMetric.update({
				where: { id, userId },
				data: { ...data },
			})
		)

		if (result.isFailure()) return result

		return success(BodyMetricMapper.toEntity(result.value))
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.bodyMetric.delete({
				where: { id, userId },
			})
		)

		if (result.isFailure()) {
			return failure(result.error)
		}

		return success(undefined)
	}
}
