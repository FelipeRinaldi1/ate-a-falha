import { z } from 'zod'

export const createBodyMetricSchema = z.object({
	weight: z.number().positive(),
	height: z.number().int().positive(),
	activityLevel: z.number().int().min(0).max(4),
	bodyFat: z.number().positive().min(0).max(50).optional().nullable(),
	muscleRate: z.number().positive().min(0).max(100).optional().nullable(),
})

export const updateBodyMetricSchema = createBodyMetricSchema.partial()

export const bodyMetricSearchSchema = z.object({
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export const BodyMetricSchema = z.object({
	id: z.uuid(),
	...createBodyMetricSchema.shape,
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type BodyMetricDTO = z.infer<typeof BodyMetricSchema>
export type CreateBodyMetricDTO = z.infer<typeof createBodyMetricSchema>
export type UpdateBodyMetricDTO = z.infer<typeof updateBodyMetricSchema>
export type BodyMetricSearchDTO = z.infer<typeof bodyMetricSearchSchema>
