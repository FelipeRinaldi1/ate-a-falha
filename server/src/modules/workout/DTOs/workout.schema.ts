import z from 'zod'

export const CreateWorkoutSchema = z.object({
	name: z.string().min(3).max(32).optional(),
	day: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
	planId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const UpdateWorkoutSchema = CreateWorkoutSchema.partial()

export type CreateWorkoutDTO = z.infer<typeof CreateWorkoutSchema>
export type UpdateWorkoutDTO = z.infer<typeof UpdateWorkoutSchema>
