import { z } from 'zod'
import { mealLogSchema } from './mealLog.schema.js'

export const dailyLogSchema = z.object({
	id: z.uuid(),
	userId: z.uuid('Invalid User ID format'),
	date: z.date(),
	meals: z.array(z.object(mealLogSchema.shape)),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createDailyLogSchema = dailyLogSchema.pick({
	date: true,
})

export const updateDailyLogSchema = createDailyLogSchema.partial()

export type CreateDailyLogDTO = z.infer<typeof createDailyLogSchema>
export type UpdateDailyLogDTO = z.infer<typeof updateDailyLogSchema>
export type DailyLogDTO = z.infer<typeof dailyLogSchema>
