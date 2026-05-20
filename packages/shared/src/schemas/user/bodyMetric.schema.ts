import { z } from 'zod'

export const bodyMetricSchema = z.object({
	id: z.uuid(),
	userId: z.uuid(),
	weight: z.number().positive(),
	height: z.number().int().positive(),
	activityLevel: z.number().int().min(0).max(4),
	bodyFat: z.number().nonnegative().max(50).optional().nullable().default(null),
	muscleRate: z.number().nonnegative().max(100).optional().nullable().default(null),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createBodyMetricSchema = bodyMetricSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
})

export const updateBodyMetricSchema = createBodyMetricSchema.partial()

export const bodyMetricSearchSchema = z.object({
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export type BodyMetricDTO = z.infer<typeof bodyMetricSchema>
export type CreateBodyMetricDTO = z.infer<typeof createBodyMetricSchema>
export type UpdateBodyMetricDTO = z.infer<typeof updateBodyMetricSchema>
export type BodyMetricSearchDTO = z.infer<typeof bodyMetricSearchSchema>
