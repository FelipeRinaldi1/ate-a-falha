import { z } from 'zod'

export const exerciseSchema = z.object({
	id: z.uuid(),
	name: z.string().min(2).max(64),
	externalId: z.string(),
	primaryMuscles: z.array(z.string()),
	secondaryMuscles: z.array(z.string()),
	instructions: z.array(z.string()),
	category: z.string().min(2),
	images: z.array(z.string()),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createExerciseSchema = exerciseSchema.pick({
	name: true,
	externalId: true,
	primaryMuscles: true,
	secondaryMuscles: true,
	instructions: true,
	category: true,
	images: true,
})

export const updateExerciseSchema = createExerciseSchema.partial()

export const searchExerciseSchema = z.object({
	name: z.string().optional(),
	primaryMuscles: z.string().optional(),
	secondaryMuscles: z.string().optional(),
	category: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(1000).default(10),
})

export type ExerciseDTO = z.infer<typeof exerciseSchema>
export type CreateExerciseDTO = z.infer<typeof createExerciseSchema>
export type UpdateExerciseDTO = z.infer<typeof updateExerciseSchema>
export type SearchExerciseDTO = z.infer<typeof searchExerciseSchema>
