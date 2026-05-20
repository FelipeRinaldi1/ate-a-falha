import { z } from 'zod'

export const foodSchema = z.object({
	id: z.uuid(),
	userId: z.string().nullable(),
	name: z.string(),
	calories: z.number(),
	carbohydrate: z.number(),
	protein: z.number(),
	lipids: z.number(),
	fiber: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createFoodSchema = foodSchema.pick({
	name: true,
	calories: true,
	carbohydrate: true,
	protein: true,
	lipids: true,
	fiber: true,
})

export const updateFoodSchema = createFoodSchema.partial()

export const foodSearchSchema = z.object({
	name: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export type CreateFoodDTO = z.infer<typeof createFoodSchema>
export type UpdateFoodDTO = z.infer<typeof updateFoodSchema>
export type FoodSearchDTO = z.infer<typeof foodSearchSchema>
export type FoodDTO = z.infer<typeof foodSchema>
