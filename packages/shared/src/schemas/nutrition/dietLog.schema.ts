import { z } from 'zod'
import { mealLogSchema } from './mealLog.schema.js'

export const dietLogSchema = z.object({
	id: z.uuid(),
	userId: z.uuid('Invalid User ID format'),
	date: z.coerce.date(),
	meals: z.array(z.object(mealLogSchema.shape)),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createDietLogSchema = dietLogSchema.pick({
	date: true,
})

export const updateDietLogSchema = createDietLogSchema.partial()

export type CreateDietLogDTO = z.infer<typeof createDietLogSchema>
export type UpdateDietLogDTO = z.infer<typeof updateDietLogSchema>
export type DietLogDTO = z.infer<typeof dietLogSchema>
