import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 6

export const authSchema = z.object({
	id: z.uuid(),
	email: z.email('Invalid email address'),
	password: z.string().min(MIN_PASSWORD_LENGTH, 'Password must be at least 6 characters long'),
	userId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createAuthSchema = authSchema.omit({
	id: true,
	userId: true,
	createdAt: true,
	updatedAt: true,
})

export const updateAuthSchema = createAuthSchema.partial()

export const loginSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

export const changePasswordSchema = z
	.object({
		oldPassword: z.string().min(1, 'Old password is required'),
		newPassword: z.string().min(MIN_PASSWORD_LENGTH, 'New password must be at least 6 characters long'),
	})
	.refine((data) => data.oldPassword !== data.newPassword, {
		message: 'New password must be different from old password',
		path: ['newPassword'],
	})

export const changeEmailSchema = z.object({
	newEmail: z.email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
})

export type CreateAuthDTO = z.infer<typeof createAuthSchema>
export type UpdateAuthDTO = z.infer<typeof updateAuthSchema>
export type LoginDTO = z.infer<typeof loginSchema>
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>
export type ChangeEmailDTO = z.infer<typeof changeEmailSchema>
