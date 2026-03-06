import { z } from 'zod'

export const createFoodSchema = z.object({
  name: z.string().min(1, 'Name is mandatory'),
  baseUnit: z.enum(['g', 'ml', 'un', 'serving']),
  baseAmount: z.number().positive(),
  calories: z.number().nonnegative(),
  carbohydrate: z.number().nonnegative(),
  protein: z.number().nonnegative(),
  fat: z.number().nonnegative(),
  fiber: z.number().nonnegative().optional().nullable(),
})

export const updateFoodSchema = createFoodSchema.partial()

export const foodSearchSchema = z.object({
  name: z.string().optional(),
  cursorId: z.string().optional(),
  take: z.coerce.number().min(1).max(100).default(10),
})

export type createFoodDTO = z.infer<typeof createFoodSchema>
export type updateFoodDTO = z.infer<typeof updateFoodSchema>
export type foodSearchDTO = z.infer<typeof foodSearchSchema>
