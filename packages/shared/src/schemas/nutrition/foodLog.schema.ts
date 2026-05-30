import { z } from 'zod'
import { foodSchema } from './food.schema.js'

export const foodLogSchema = z.object({
	id: z.uuid(),
	foodId: z.uuid(),
	food: foodSchema,
	quantity: z.number().positive(),
	mealLogId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createFoodLogSchema = foodLogSchema.pick({
	quantity: true,
	foodId: true,
})

export const updateFoodLogSchema = createFoodLogSchema.partial()

export type CreateFoodLogDTO = z.infer<typeof createFoodLogSchema>
export type UpdateFoodLogDTO = z.infer<typeof updateFoodLogSchema>
export type FoodLogDTO = z.infer<typeof foodLogSchema>
