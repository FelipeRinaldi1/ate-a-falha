import { z } from 'zod'

export const CreatePlanSchema = z.object({
	name: z
		.string()
		.min(3, 'O nome do plano deve ter pelo menos 3 caracteres')
		.max(50, 'O nome do plano é muito longo'),

	isActive: z.boolean().optional().default(true),

	userId: z.uuid('ID de usuário inválido'),
})

export const UpdatePlanSchema = CreatePlanSchema.partial()

export const PlanSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(3).max(50),
	isActive: z.boolean(),
	userId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type PlanDTO = z.infer<typeof PlanSchema>
export type CreatePlanDTO = z.infer<typeof CreatePlanSchema>
export type UpdatePlanDTO = z.infer<typeof UpdatePlanSchema>

import { Prisma } from '@/generated/prisma/client.js'

export type PlanFull = Prisma.PlanGetPayload<{
	include: {
		workouts: {
			include: {
				workoutExercises: {
					include: {
						sets: true
						exercise: true
					}
				}
			}
		}
	}
}>
