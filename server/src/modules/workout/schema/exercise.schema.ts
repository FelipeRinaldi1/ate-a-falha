import { z } from 'zod'

export const CreateExerciseSchema = z.object({
	name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(64),
	muscleGroup: z.string().min(2, 'Informe o grupamento muscular'),
	description: z.string().max(255).optional().nullable(),
	imageUrl: z.string().url('URL da imagem inválida').optional().nullable(),
})
export const UpdateExerciseSchema = CreateExerciseSchema.partial()

export const SearchExerciseSchema = z.object({
	name: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export const ExerciseSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2).max(64),
	muscleGroup: z.string().min(2),
	description: z.string().max(255).nullable(),
	imageUrl: z.string().url().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type ExerciseDTO = z.infer<typeof ExerciseSchema>
export type CreateExerciseDTO = z.infer<typeof CreateExerciseSchema>
export type UpdateExerciseDTO = z.infer<typeof UpdateExerciseSchema>
export type SearchExerciseDTO = z.infer<typeof SearchExerciseSchema>

import { Prisma } from '@/generated/prisma/client.js'
export type ExerciseFull = Prisma.ExerciseGetPayload<{ include: { usedInWorkouts: true } }>
