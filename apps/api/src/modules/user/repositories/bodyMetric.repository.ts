import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { Result, success, failure } from '@ate-a-falha/shared'

import { IBodyMetricRepository } from '../interfaces/bodyMetric.interface.js'
import { CreateBodyMetricDTO, BodyMetricSearchDTO, UpdateBodyMetricDTO } from '@ate-a-falha/shared'
import { BodyMetricFull } from '@ate-a-falha/database'

export class BodyMetricRepository implements IBodyMetricRepository {
	async create(data: CreateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>> {
		const result = await safeCall(
			prisma.bodyMetric.create({
				data: { ...data, userId },
			})
		)
		if (result.isFailure()) return result as any

		return success(result.value)
	}

	async findAll(data: BodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricFull[]>> {
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

		if (result.isFailure()) return result as any

		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<BodyMetricFull>> {
		const result = await safeCall(
			prisma.bodyMetric.findUniqueOrThrow({
				where: { id, userId },
			})
		)

		if (result.isFailure()) return result as any

		return success(result.value)
	}

	async update(id: string, data: UpdateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>> {
		const result = await safeCall(
			prisma.bodyMetric.update({
				where: { id, userId },
				data: { ...data },
			})
		)

		if (result.isFailure()) return result as any

		return success(result.value)
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
