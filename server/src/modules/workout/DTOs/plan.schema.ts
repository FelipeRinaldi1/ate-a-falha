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

export type CreatePlanDTO = z.infer<typeof CreatePlanSchema>
export type UpdatePlanDTO = z.infer<typeof UpdatePlanSchema>
