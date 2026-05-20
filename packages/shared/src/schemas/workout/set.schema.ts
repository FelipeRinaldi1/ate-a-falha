import { z } from 'zod'

export const setSchema = z.object({
	id: z.uuid(),
	workoutExerciseId: z.uuid(),
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable(),
	restTimeSeconds: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createSetSchema = setSchema.pick({
	setNumber: true,
	repetitions: true,
	weight: true,
	restTimeSeconds: true,
})

export const updateSetSchema = createSetSchema.partial()

export type SetDTO = z.infer<typeof setSchema>
export type CreateSetDTO = z.infer<typeof createSetSchema>
export type UpdateSetDTO = z.infer<typeof updateSetSchema>
