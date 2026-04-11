import { failure, Result, success } from "@ate-a-falha/shared"

import { safeCall } from '@ate-a-falha/database'
import { CreatePlanDTO, UpdatePlanDTO } from "@ate-a-falha/shared"
import { PlanFull } from "@ate-a-falha/database"

import { IPlanRepository } from '../interfaces/plan.interface.js'
import { prisma } from '@ate-a-falha/database'

export class PlanRepository implements IPlanRepository {
	async create(data: CreatePlanDTO, userId: string): Promise<Result<PlanFull>> {
		const result = await safeCall(
			prisma.plan.create({
				data: {
					...data,
					userId: userId,
				},
				include: {
					workouts: {
						include: {
							workoutExercises: {
								include: {
									sets: true,
									exercise: true,
								},
							},
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanFull>> {
		const result = await safeCall(
			prisma.plan.update({
				where: {
					id: id,
					userId: userId,
				},
				data: data,
				include: {
					workouts: {
						include: {
							workoutExercises: {
								include: {
									sets: true,
									exercise: true,
								},
							},
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
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

	async findAll(userId: string): Promise<Result<PlanFull[]>> {
		const result = await safeCall(
			prisma.plan.findMany({
				where: {
					userId: userId,
				},
				include: {
					workouts: {
						include: {
							workoutExercises: {
								include: {
									sets: true,
									exercise: true,
								},
							},
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<PlanFull>> {
		const result = await safeCall(
			prisma.plan.findUniqueOrThrow({
				where: {
					id: id,
					userId: userId,
				},
				include: {
					workouts: {
						include: {
							workoutExercises: {
								include: {
									sets: true,
									exercise: true,
								},
							},
						},
					},
				},
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
}
