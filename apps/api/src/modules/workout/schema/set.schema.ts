import { z } from 'zod'

export const CreateSetSchema = z.object({
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable().optional(),
	restTimeSeconds: z.number().int().nonnegative(),
})

export const UpdateSetSchema = CreateSetSchema.partial()

export const SetSchema = z.object({
	id: z.string().uuid(),
	setNumber: z.number().int().positive(),
	repetitions: z.number().int().positive(),
	weight: z.number().nonnegative().nullable(),
	restTimeSeconds: z.number().int().nonnegative(),
	workoutExerciseId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type SetDTO = z.infer<typeof SetSchema>
export type CreateSetDTO = z.infer<typeof CreateSetSchema>
export type UpdateSetDTO = z.infer<typeof UpdateSetSchema>

import { Prisma } from '@/generated/prisma/client.js'
export type SetFull = Prisma.SetGetPayload<{}>
