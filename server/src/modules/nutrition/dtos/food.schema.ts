import {z} from "zod"

//Must add Regex and validation

export const createFoodSchema=z.object({
    name: z.string(),
    baseUnit: z.string(),
    baseAmount: z.number(),

    calories: z.number(),
    carbohydrate: z.number(),
    protein: z.number(),
    fat: z.number(),
    fiber: z.number().optional()

})

export const updateFoodSchema = createFoodSchema.partial()

export const foodSearchSchema=z.object({
    page: z.number(),
    perPage: z.number(),
    name: z.string().optional(),
})

export type createFoodDTO = z.infer<typeof createFoodSchema> 
export type updateFoodDTO = z.infer<typeof updateFoodSchema>
export type foodSearchDTO = z.infer<typeof foodSearchSchema>