import z from 'zod'

export const CreateFoodInMealSchema = z.object({
	quantity: z.number().positive(),
})

export const UpdateFoodInMealSchema = CreateFoodInMealSchema.partial()

export type CreateFoodInMealDTO = z.infer<typeof CreateFoodInMealSchema>
export type UpdateFoodInMealDTO = z.infer<typeof UpdateFoodInMealSchema>
