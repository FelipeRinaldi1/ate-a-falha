import z from 'zod'

export const createFoodInMealSchema = z.object({
	quantity: z.number().positive(),
})

export const updateFoodInMealSchema = createFoodInMealSchema.partial()

export type CreateFoodInMealDTO = z.infer<typeof createFoodInMealSchema>
export type UpdateFoodInMealDTO = z.infer<typeof updateFoodInMealSchema>
