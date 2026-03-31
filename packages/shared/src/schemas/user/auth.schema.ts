import { z } from 'zod'

export const createAuthSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const updateAuthSchema = createAuthSchema.partial()

export const AuthSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6),
	userId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type CreateAuthDTO = z.infer<typeof createAuthSchema>
export type UpdateAuthDTO = z.infer<typeof updateAuthSchema>
