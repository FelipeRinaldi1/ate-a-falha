import { z } from 'zod'

const MIN_PASSWORD_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/

export const passwordSchema = z
	.string()
	.min(MIN_PASSWORD_LENGTH, 'A senha deve ter no mínimo 8 caracteres')
	.regex(PASSWORD_REGEX, 'A senha deve conter letra maiúscula, minúscula, número e símbolo')

export const authSchema = z.object({
	id: z.uuid(),
	email: z.email('Invalid email address'),
	password: passwordSchema,
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
		newPassword: passwordSchema,
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
