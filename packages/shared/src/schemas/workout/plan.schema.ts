import { z } from 'zod'
import { workoutSchema } from './workout.schema.js'

export const planSchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	name: z.string().min(3).max(50),
	isActive: z.boolean().default(false),
	goal: z.enum(['forca', 'hipertrofia', 'resistencia']).default('hipertrofia'),
	coverImageUrl: z.string().nullable().optional(),
	coverExerciseId: z.string().nullable().optional(),

	workouts: z.array(workoutSchema).optional(),

	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createPlanSchema = planSchema.pick({
	name: true,
	goal: true,
	coverImageUrl: true,
	coverExerciseId: true,
})

export const updatePlanSchema = planSchema.pick({
	name: true,
	goal: true,
	isActive: true,
	coverImageUrl: true,
	coverExerciseId: true,
}).partial()

export type PlanDTO = z.infer<typeof planSchema>
export type CreatePlanDTO = z.infer<typeof createPlanSchema>
export type UpdatePlanDTO = z.infer<typeof updatePlanSchema>
