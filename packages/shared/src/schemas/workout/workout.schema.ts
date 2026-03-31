import { z } from 'zod'

export const createworkoutSchema = z.object({
	name: z.string().min(3).max(32).optional(),
	day: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
})

export const updateworkoutSchema = createworkoutSchema.partial()

export const workoutSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(3).max(32).nullable(),
	day: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
	planId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type WorkoutDTO = z.infer<typeof workoutSchema>
export type CreateWorkoutDTO = z.infer<typeof createworkoutSchema>
export type UpdateWorkoutDTO = z.infer<typeof updateworkoutSchema>
