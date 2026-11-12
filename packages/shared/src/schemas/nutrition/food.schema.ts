import { z } from 'zod'

export const foodSchema = z.object({
	id: z.uuid(),
	userId: z.string().nullable(),
	name: z.string().trim().min(1).max(128),
	calories: z.number().nonnegative(),
	carbohydrate: z.number().nonnegative(),
	protein: z.number().nonnegative(),
	lipids: z.number().nonnegative(),
	fiber: z.number().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createFoodSchema = foodSchema
	.pick({
		name: true,
		carbohydrate: true,
		protein: true,
		lipids: true,
		fiber: true,
	})
	.extend({
		calories: z.number().nonnegative().optional(),
	})

export const updateFoodSchema = createFoodSchema.partial()

export const foodSearchSchema = z.object({
	name: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
	onlyMine: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
})

export type CreateFoodDTO = z.infer<typeof createFoodSchema>
export type UpdateFoodDTO = z.infer<typeof updateFoodSchema>
export type FoodSearchDTO = z.infer<typeof foodSearchSchema>
export type FoodDTO = z.infer<typeof foodSchema>
