import { z } from 'zod'
import { workoutSchema } from './workout.schema.js'

export const planSchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	name: z.string().min(3).max(50),
	isActive: z.boolean().default(false),

	workouts: z.array(workoutSchema).optional(),

	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createPlanSchema = planSchema.pick({
	name: true,
})

export const updatePlanSchema = createPlanSchema.partial()

export type PlanDTO = z.infer<typeof planSchema>
export type CreatePlanDTO = z.infer<typeof createPlanSchema>
export type UpdatePlanDTO = z.infer<typeof updatePlanSchema>
