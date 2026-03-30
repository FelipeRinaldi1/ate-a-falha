import { z } from 'zod'

export const createDietSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters').max(100),
	dailyKcalGoal: z.number().positive('Calorie goal must be a positive number'),
	dailyProteinGoal: z.number().nonnegative('Protein goal cannot be negative'),
	dailyCarbGoal: z.number().nonnegative('Carb goal cannot be negative'),
	dailyFatGoal: z.number().nonnegative('Fat goal cannot be negative'),
	dailyWaterGoal: z.number().positive('Water goal must be a positive number'),
	dailyWater: z.number().positive('Water must be a positive number'),
	userId: z.uuid('Invalid User ID format'),
})

export const updateDietSchema = createDietSchema.partial()

export const dietSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2, 'Name must be at least 2 characters').max(100),
	dailyKcalGoal: z.number().positive('Calorie goal must be a positive number'),
	dailyProteinGoal: z.number().nonnegative('Protein goal cannot be negative'),
	dailyCarbGoal: z.number().nonnegative('Carb goal cannot be negative'),
	dailyFatGoal: z.number().nonnegative('Fat goal cannot be negative'),
	dailyWaterGoal: z.number().positive('Water goal must be a positive number'),
	dailyWater: z.number().nonnegative('Water must be a nonnegative number'),
	userId: z.string().uuid('Invalid User ID format'),
	createdAt: z.date(),
	updatedAt: z.date()
})

export type DietDTO = z.infer<typeof dietSchema>
export type CreateDietDTO = z.infer<typeof createDietSchema>
export type UpdateDietDTO = z.infer<typeof updateDietSchema>

import { Prisma } from '@/generated/prisma/client.js'
export type DietFull = Prisma.DietGetPayload<{ include: { Meal: { include: { foods: { include: { food: true } } } } } }>
