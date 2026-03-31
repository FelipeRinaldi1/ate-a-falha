import { z } from 'zod'

export const createFoodInMealSchema = z.object({
	quantity: z.number().positive(),
})

export const updateFoodInMealSchema = createFoodInMealSchema.partial()

export const FoodInMealSchema = z.object({
	id: z.string().uuid(),
	quantity: z.number().positive(),
	mealId: z.string().uuid(),
	foodId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type CreateFoodInMealDTO = z.infer<typeof createFoodInMealSchema>
export type UpdateFoodInMealDTO = z.infer<typeof updateFoodInMealSchema>
export type FoodInMealDTO = z.infer<typeof FoodInMealSchema>
