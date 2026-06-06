import { failure, type Result, success, type CreatePlanDTO, type UpdatePlanDTO } from '@ate-a-falha/shared'
import { prisma, safeCall, type PlanFull } from '@ate-a-falha/database'

import type { IPlanRepository } from '../interfaces/plan.interface.js'

export class PlanRepository implements IPlanRepository {
	async create(data: CreatePlanDTO, userId: string): Promise<Result<PlanFull>> {
		const result = await safeCall(
			prisma.$transaction(async (tx) => {
				const existingCount = await tx.plan.count({
					where: { userId: userId },
				})
				return tx.plan.create({
					data: {
						...data,
						userId: userId,
						isActive: existingCount === 0,
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
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(result.value)
	}
	async update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanFull>> {
		const result = await safeCall(
			prisma.$transaction(async (tx) => {
				if (data.isActive === true) {
					await tx.plan.updateMany({
						where: {
							userId: userId,
							NOT: { id: id },
						},
						data: {
							isActive: false,
						},
					})
				}
				return tx.plan.update({
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

	async findPublicById(id: string): Promise<Result<PlanFull>> {
		const result = await safeCall(
			prisma.plan.findFirstOrThrow({
				where: {
					id: id,
					isExported: true,
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

	async importPlan(targetPlanId: string, userId: string): Promise<Result<PlanFull>> {
		const targetResult = await this.findPublicById(targetPlanId)
		if (targetResult.isFailure()) return failure(targetResult.error)
		const targetPlan = targetResult.value

		const importResult = await safeCall(
			prisma.$transaction(async (tx) => {
				const newPlan = await tx.plan.create({
					data: {
						name: `${targetPlan.name} (Importado)`,
						goal: targetPlan.goal,
						coverImageUrl: targetPlan.coverImageUrl,
						coverExerciseId: targetPlan.coverExerciseId,
						userId: userId,
						isActive: false,
					},
				})

				for (const w of targetPlan.workouts || []) {
					const newWorkout = await tx.workout.create({
						data: {
							name: w.name,
							day: w.day,
							weekDay: w.weekDay,
							planId: newPlan.id,
						},
					})

					for (const we of w.workoutExercises || []) {
						const newWE = await tx.workoutExercise.create({
							data: {
								orderIndex: we.orderIndex,
								exerciseId: we.exerciseId,
								workoutId: newWorkout.id,
							},
						})

						for (const s of we.sets || []) {
							await tx.set.create({
								data: {
									setNumber: s.setNumber,
									repetitions: s.repetitions,
									weight: s.weight,
									restTimeSeconds: s.restTimeSeconds,
									workoutExerciseId: newWE.id,
								},
							})
						}
					}
				}

				return tx.plan.findUniqueOrThrow({
					where: { id: newPlan.id },
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
			})
		)

		if (importResult.isFailure()) return failure(importResult.error)
		return success(importResult.value)
	}
}
