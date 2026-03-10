import { z } from 'zod'

export const SetSchema = z.object({
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable().optional(),
	restTimeSeconds: z.number().int().nonnegative(),
})

export const UpdateSetSchema = SetSchema.partial()

export type SetDTO = z.infer<typeof SetSchema>
export type UpdateSetDTO = z.infer<typeof UpdateSetSchema>
