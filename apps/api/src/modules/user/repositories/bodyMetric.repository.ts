import { prisma, safeCall } from '@ate-a-falha/database'

import type { IBodyMetricRepository } from '../interfaces/bodyMetric.interface.js'
import {
	type CreateBodyMetricDTO,
	type BodyMetricSearchDTO,
	type UpdateBodyMetricDTO,
	type Result,
	success,
	failure,
} from '@ate-a-falha/shared'
import { type BodyMetricFull } from '@ate-a-falha/database'

export class BodyMetricRepository implements IBodyMetricRepository {
	async create(
		data: CreateBodyMetricDTO & { bmi: number; bmr: number; tdee: number },
		userId: string
	): Promise<Result<BodyMetricFull>> {
		const result = await safeCall(
			prisma.bodyMetric.create({
				data: { ...data, userId },
			})
		)
		return result
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

		return result
	}

	async findById(id: string, userId: string): Promise<Result<BodyMetricFull>> {
		const result = await safeCall(
			prisma.bodyMetric.findUniqueOrThrow({
				where: { id, userId },
			})
		)

		return result
	}

	async update(
		id: string,
		data: UpdateBodyMetricDTO & { bmi?: number; bmr?: number; tdee?: number },
		userId: string
	): Promise<Result<BodyMetricFull>> {
		const result = await safeCall(
			prisma.bodyMetric.update({
				where: { id, userId },
				data: { ...data },
			})
		)

		return result
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

	async countBodyMetrics(userId: string): Promise<Result<number>> {
		const result = await safeCall(prisma.bodyMetric.count({ where: { userId } }))

		return result
	}
}
