import { z } from 'zod'

export const createexerciseSchema = z.object({
	name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(64),
	primaryMuscles: z.string().min(2, 'Informe o grupo muscular principal'),
	secondaryMuscles: z.string().min(2, 'Informe o grupo muscular secundário'),
	instructions: z.string().max(255).optional().nullable(),
	category: z.string().min(2, 'Informe a categoria do exercício'),
	imageUrl: z.string(),
})
export const updateexerciseSchema = createexerciseSchema.partial()

export const searchexerciseSchema = z.object({
	name: z.string().optional(),
	primaryMuscles: z.string().optional(),
	secondaryMuscles: z.string().optional(),
	category: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export const exerciseSchema = z.object({
	id: z.uuid(),
	externalId: z.string().optional(),
	name: z.string().min(2).max(64),
	primaryMuscles: z.string().min(2),
	secondaryMuscles: z.string().min(2),
	instructions: z.string().max(255).nullable(),
	category: z.string().min(2),
	imageUrl: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type ExerciseDTO = z.infer<typeof exerciseSchema>
export type CreateExerciseDTO = z.infer<typeof createexerciseSchema>
export type UpdateExerciseDTO = z.infer<typeof updateexerciseSchema>
export type SearchExerciseDTO = z.infer<typeof searchexerciseSchema>
