import { z } from 'zod'
import { foodSchema } from './food.schema.js'

export const foodInMealSchema = z.object({
	id: z.uuid(),
	foodId: z.uuid(),
	food: foodSchema,
	quantity: z.number().positive(),
	mealId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createFoodInMealSchema = foodInMealSchema.pick({
	quantity: true,
	foodId: true,
})

export const updateFoodInMealSchema = createFoodInMealSchema.partial()

export type CreateFoodInMealDTO = z.infer<typeof createFoodInMealSchema>
export type UpdateFoodInMealDTO = z.infer<typeof updateFoodInMealSchema>
export type FoodInMealDTO = z.infer<typeof foodInMealSchema>
