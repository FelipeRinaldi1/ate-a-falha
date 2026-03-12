import { failure, Result, success } from '@/@utils/result.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { CreatePlanDTO, UpdatePlanDTO } from '../DTOs/plan.schema.js'
import { PlanEntity } from '../entities/workoutPlan.entity.js'
import { IPlanRepository } from '../interfaces/plan.interface.js'
import { prisma } from '@/@infra/prisma.client.js'
import { PlanMapper } from '../mappers/plan.mapper.js'

export class PlanRepository implements IPlanRepository {
	async create(data: CreatePlanDTO, userId: string): Promise<Result<PlanEntity>> {
		const result = await safeCall(
			prisma.plan.create({
				data: {
					...data,
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(PlanMapper.toEntity(result.value))
	}
	async update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanEntity>> {
		const result = await safeCall(
			prisma.plan.update({
				where: {
					id: id,
					userId: userId,
				},
				data: data,
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(PlanMapper.toEntity(result.value))
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.plan.delete({
				where: {
					id: id,
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(undefined)
	}

	async findAll(userId: string): Promise<Result<PlanEntity[]>> {
		const result = await safeCall(
			prisma.plan.findMany({
				where: {
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		const entities = result.value.map((val) => PlanMapper.toEntity(val))
		return success(entities)
	}

	async findById(id: string, userId: string): Promise<Result<PlanEntity>> {
		const result = await safeCall(
			prisma.plan.findUniqueOrThrow({
				where: {
					id: id,
					userId: userId,
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
