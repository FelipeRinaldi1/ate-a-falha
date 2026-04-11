import { z } from 'zod'
import { FoodSchema } from './food.schema.js'

export const createFoodInMealSchema = z.object({
	quantity: z.number().positive(),
})

export const updateFoodInMealSchema = createFoodInMealSchema.partial()

export const FoodInMealSchema = z.object({
	id: z.uuid(),
	food: FoodSchema,
	quantity: z.number().positive(),
	mealId: z.uuid(),
	foodId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type CreateFoodInMealDTO = z.infer<typeof createFoodInMealSchema>
export type UpdateFoodInMealDTO = z.infer<typeof updateFoodInMealSchema>
export type FoodInMealDTO = z.infer<typeof FoodInMealSchema>
