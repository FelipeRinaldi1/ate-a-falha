import { z } from 'zod'

export const CreateSetSchema = z.object({
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable().optional(),
	restTimeSeconds: z.number().int().nonnegative(),
})

export const UpdateSetSchema = CreateSetSchema.partial()

export type CreateSetDTO = z.infer<typeof CreateSetSchema>
export type UpdateSetDTO = z.infer<typeof UpdateSetSchema>
