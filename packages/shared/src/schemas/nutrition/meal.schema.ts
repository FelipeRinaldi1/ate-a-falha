import { z } from 'zod'

export const createMealSchema = z.object({
	name: z.string().min(1, 'Name is required').max(64, 'Name must be at most 64 characters'),
	time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'),
	orderIndex: z.number().int().min(0, 'Order index must be a positive integer'),
})

export const updateMealSchema = createMealSchema.partial()

export const MealSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(64),
	time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
	orderIndex: z.number().int().min(0),
	dietId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type CreateMealDTO = z.infer<typeof createMealSchema>
export type UpdateMealDTO = z.infer<typeof updateMealSchema>
export type MealDTO = z.infer<typeof MealSchema>
