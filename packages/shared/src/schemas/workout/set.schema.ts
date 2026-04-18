import { z } from 'zod'

export const createsetSchema = z.object({
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable().optional(),
	restTimeSeconds: z.number().int().nonnegative(),
})

export const updatesetSchema = createsetSchema.partial()

export const setSchema = z.object({
	id: z.uuid(),
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable(),
	restTimeSeconds: z.number().int().nonnegative(),
	workoutExerciseId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type SetDTO = z.infer<typeof setSchema>
export type CreateSetDTO = z.infer<typeof createsetSchema>
export type UpdateSetDTO = z.infer<typeof updatesetSchema>
