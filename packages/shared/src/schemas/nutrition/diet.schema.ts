import { z } from 'zod'
export const dietSchema = z.object({
	id: z.uuid(),
	name: z.string().min(2, 'Name must be at least 2 characters').max(100),
	dailyKcalGoal: z.number().positive('Calorie goal must be a positive number'),
	dailyProteinGoal: z.number().nonnegative('Protein goal cannot be negative'),
	dailyCarbGoal: z.number().nonnegative('Carb goal cannot be negative'),
	dailyFatGoal: z.number().nonnegative('Fat goal cannot be negative'),
	dailyWaterGoal: z.number().positive('Water goal must be a positive number'),
	dailyWater: z.number().nonnegative('Water must be a nonnegative number'),
	userId: z.uuid('Invalid User ID format'),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createDietSchema = dietSchema.pick({
	name: true,
	dailyKcalGoal: true,
	dailyProteinGoal: true,
	dailyCarbGoal: true,
	dailyFatGoal: true,
	dailyWaterGoal: true,
	dailyWater: true,
})

export const updateDietSchema = createDietSchema.partial()

export type CreateDietDTO = z.infer<typeof createDietSchema>
export type UpdateDietDTO = z.infer<typeof updateDietSchema>
export type DietDTO = z.infer<typeof dietSchema>
