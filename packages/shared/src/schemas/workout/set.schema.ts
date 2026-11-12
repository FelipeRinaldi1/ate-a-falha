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

export const createSetSchema = setSchema
	.pick({
		repetitions: true,
		restTimeSeconds: true,
	})
	.extend({
		setNumber: z.number().int().positive().optional(),
		weight: z.number().nonnegative().nullable().optional(),
	})

export const updateSetSchema = createSetSchema.partial()

export const replaceSetsSchema = z.object({
	sets: z.array(createSetSchema),
})

export type SetDTO = z.infer<typeof setSchema>
export type CreateSetDTO = z.infer<typeof createSetSchema>
export type UpdateSetDTO = z.infer<typeof updateSetSchema>
export type ReplaceSetsDTO = z.infer<typeof replaceSetsSchema>
