import {z} from "zod"

import { FoodUncheckedCreateInputSchema,FoodUncheckedUpdateInputSchema } from "../../../generated/zod/index.js"

export const createFoodSchema = FoodUncheckedCreateInputSchema;
export const updateFoodSchema = FoodUncheckedUpdateInputSchema;

export const foodSearchSchema=z.object({
    page: z.number(),
    perPage: z.number(),
    name: z.string().optional(),
})

export type createFoodDTO = z.infer<typeof createFoodSchema> 
export type updateFoodDTO = z.infer<typeof updateFoodSchema>
export type foodSearchDTO = z.infer<typeof foodSearchSchema>