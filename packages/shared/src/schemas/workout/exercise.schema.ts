import { z } from 'zod'

export const createexerciseSchema = z.object({
	name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(64),
	externalId: z.string(),
	primaryMuscles: z.array(z.string()),
	secondaryMuscles: z.array(z.string()),
	instructions: z.array(z.string()),
	category: z.string().min(2, 'Informe a categoria do exercício'),
	images: z.array(z.string()),
})
export const updateexerciseSchema = createexerciseSchema.partial()

export const searchexerciseSchema = z.object({
	name: z.string().optional(),
	primaryMuscles: z.array(z.string()).optional(),
	secondaryMuscles: z.array(z.string()).optional(),
	category: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export const exerciseSchema = z.object({
	id: z.uuid(),
	name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(64),
	externalId: z.string(),
	primaryMuscles: z.array(z.string()),
	secondaryMuscles: z.array(z.string()),
	instructions: z.array(z.string()),
	category: z.string().min(2, 'Informe a categoria do exercício'),
	images: z.array(z.string()),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type ExerciseDTO = z.infer<typeof exerciseSchema>
export type CreateExerciseDTO = z.infer<typeof createexerciseSchema>
export type UpdateExerciseDTO = z.infer<typeof updateexerciseSchema>
export type SearchExerciseDTO = z.infer<typeof searchexerciseSchema>

