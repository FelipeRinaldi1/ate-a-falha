import { z } from 'zod'

export const createMealSchema = z.object({
	name: z.string().min(1, 'Name is required').max(64, 'Name must be at most 64 characters'),
	time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be in HH:mm format'),
	orderIndex: z.number().int().min(0, 'Order index must be a positive integer'),
})

export const updateMealSchema = createMealSchema.partial()

export type CreateMealDTO = z.infer<typeof createMealSchema>
export type UpdateMealDTO = z.infer<typeof updateMealSchema>
