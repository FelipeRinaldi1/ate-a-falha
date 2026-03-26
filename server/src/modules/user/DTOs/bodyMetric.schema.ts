import { z } from 'zod'

export const createBodyMetricSchema = z.object({
  weight: z.number().positive(),
  height: z.number().int().positive(),
  activityLevel: z.number().int().min(1).max(7),
  bodyFat: z.number().positive().optional().nullable(),
  muscleRate: z.number().positive().optional().nullable(),
})

export const updateBodyMetricSchema = createBodyMetricSchema.partial()

export const bodyMetricSearchSchema = z.object({
  cursorId: z.string().optional(),
  take: z.coerce.number().min(1).max(100).default(10),
})

export type createBodyMetricDTO = z.infer<typeof createBodyMetricSchema>
export type updateBodyMetricDTO = z.infer<typeof updateBodyMetricSchema>
export type bodyMetricSearchDTO = z.infer<typeof bodyMetricSearchSchema>
