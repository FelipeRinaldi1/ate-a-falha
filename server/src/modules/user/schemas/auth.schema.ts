import { z } from 'zod'

export const CreateAuthSchema = z.object({
	email: z.email(),
	password: z.string(),
})

export const UpdateAuthSchema = CreateAuthSchema.partial()

export type CreateAuthDTO = z.infer<typeof CreateAuthSchema>
export type UpdateAuthDTO = z.infer<typeof UpdateAuthSchema>
