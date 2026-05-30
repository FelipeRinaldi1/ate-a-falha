import { z } from 'zod'
import { foodLogSchema } from './foodLog.schema.js'

export const mealLogSchema = z.object({
	id: z.uuid(),
	dietLogId: z.uuid(),
	foods: z.array(z.object(foodLogSchema.shape)),
	name: z.string().min(1).max(64),
	time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
	orderIndex: z.number().int().min(0),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createMealLogSchema = mealLogSchema.pick({
	name: true,
	time: true,
	orderIndex: true,
})

export const updateMealLogSchema = createMealLogSchema.partial()

export type CreateMealLogDTO = z.infer<typeof createMealLogSchema>
export type UpdateMealLogDTO = z.infer<typeof updateMealLogSchema>
export type MealLogDTO = z.infer<typeof mealLogSchema>
