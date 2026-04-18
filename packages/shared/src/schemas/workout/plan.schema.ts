import { z } from 'zod'

export const createplanSchema = z.object({
	name: z
		.string()
		.min(3, 'O nome do plano deve ter pelo menos 3 caracteres')
		.max(50, 'O nome do plano é muito longo'),

	isActive: z.boolean().optional().default(true),

	userId: z.string().uuid('ID de usuário inválido'),
})

export const updateplanSchema = createplanSchema.partial()

export const planSchema = z.object({
	id: z.uuid(),
	name: z.string().min(3).max(50),
	isActive: z.boolean(),
	userId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type PlanDTO = z.infer<typeof planSchema>
export type CreatePlanDTO = z.infer<typeof createplanSchema>
export type UpdatePlanDTO = z.infer<typeof updateplanSchema>
