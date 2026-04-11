import { z } from 'zod'

export const createFoodSchema = z.object({
  name: z.string().min(1, 'Name is mandatory'),
  baseUnit: z.enum(['g', 'ml', 'un', 'serving']),
  baseAmount: z.number().positive(),
  calories: z.number().nonnegative(),
  carbohydrate: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  fiber: z.number().nonnegative(),
})

export const updateFoodSchema = createFoodSchema.partial()

export const foodSearchSchema = z.object({
  name: z.string().optional(),
  cursorId: z.string().optional(),
  take: z.coerce.number().min(1).max(100).default(10),
})

export const FoodSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  baseUnit: z.string(),
  baseAmount: z.number(),
  calories: z.number(),
  carbohydrate: z.number(),
  protein: z.number(),
  fat: z.number(),
  fiber: z.number(),
  userId: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type CreateFoodDTO = z.infer<typeof createFoodSchema>
export type UpdateFoodDTO = z.infer<typeof updateFoodSchema>
export type FoodSearchDTO = z.infer<typeof foodSearchSchema>
export type FoodDTO = z.infer<typeof FoodSchema>
