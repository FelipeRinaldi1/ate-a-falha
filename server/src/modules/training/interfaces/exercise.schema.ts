import {z} from "zod";

export const createExerciseSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500),
  muscleGroup: z.string().min(2).max(100),
  imageUrl: z.url().optional(),
})

export const updateExerciseSchema = createExerciseSchema.partial()

export const exerciseSearchSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  perPage: z.coerce.number().min(1).max(100).default(10),
  name: z.string().optional(),
  muscleGroup: z.string().optional(),
})

export type createExerciseDTO = z.infer<typeof createExerciseSchema>
export type updateExerciseDTO = z.infer<typeof updateExerciseSchema>
export type exerciseSearchDTO = z.input<typeof exerciseSearchSchema>