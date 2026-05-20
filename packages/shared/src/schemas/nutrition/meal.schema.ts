import { z } from 'zod'
import { foodInMealSchema } from './foodInMeal.schema.js'

export const mealSchema = z.object({
	id: z.uuid(),
	dietId: z.uuid(),
	foodsInMeal: z.array(z.object(foodInMealSchema.shape)),
	name: z.string().min(1).max(64),
	time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
	orderIndex: z.number().int().min(0),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createMealSchema = mealSchema.pick({
	name: true,
	time: true,
	orderIndex: true,
})

export const updateMealSchema = createMealSchema.partial()

export type CreateMealDTO = z.infer<typeof createMealSchema>
export type UpdateMealDTO = z.infer<typeof updateMealSchema>
export type MealDTO = z.infer<typeof mealSchema>
