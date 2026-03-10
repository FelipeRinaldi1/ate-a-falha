import { z } from 'zod'

export const CreateExerciseSchema = z.object({
	name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').max(64),
	muscleGroup: z.string().min(2, 'Informe o grupamento muscular'),
	description: z.string().max(255).optional().nullable(),
	imageUrl: z.url('URL da imagem inválida').optional().nullable(),
})
export const UpdateExerciseSchema = CreateExerciseSchema.partial()

export const SearchExerciseSChema = z.object({
	name: z.string().optional(),
	cursorId: z.string().optional(),
	take: z.coerce.number().min(1).max(100).default(10),
})

export type CreateExerciseDTO = z.infer<typeof CreateExerciseSchema>
export type UpdateExerciseDTO = z.infer<typeof UpdateExerciseSchema>
export type SearchExerciseDTO = z.infer<typeof SearchExerciseSChema>
