import { z } from 'zod'
export const dietSchema = z.object({
	id: z.uuid(),
	name: z.string().min(2, 'Name must be at least 2 characters').max(64),
	dailyKcalGoal: z.number().int().positive('Calorie goal must be a positive integer'),
	dailyProteinGoal: z.number().int().nonnegative('Protein goal cannot be negative'),
	dailyCarbGoal: z.number().int().nonnegative('Carb goal cannot be negative'),
	dailyFatGoal: z.number().int().nonnegative('Fat goal cannot be negative'),
	dailyFiberGoal: z.number().int().nonnegative('Fiber goal cannot be negative').default(25),
	dailyWaterGoal: z.number().int().positive('Water goal must be a positive integer'),
	dailyWater: z.number().int().nonnegative('Water must be a nonnegative integer'),
	userId: z.uuid('Invalid User ID format'),
	isExported: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createDietSchema = dietSchema.pick({
	name: true,
	dailyKcalGoal: true,
	dailyProteinGoal: true,
	dailyCarbGoal: true,
	dailyFatGoal: true,
	dailyFiberGoal: true,
	dailyWaterGoal: true,
	dailyWater: true,
	isExported: true,
})

export const updateDietSchema = createDietSchema.partial()

export type CreateDietDTO = z.infer<typeof createDietSchema>
export type UpdateDietDTO = z.infer<typeof updateDietSchema>
export type DietDTO = z.infer<typeof dietSchema>
