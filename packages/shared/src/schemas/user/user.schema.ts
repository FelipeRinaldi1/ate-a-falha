import { z } from 'zod'
import { authSchema, createAuthSchema, updateAuthSchema } from './auth.schema.js'

export const GENDER = z.enum(['MALE', 'FEMALE', 'OTHER'])
export const ROLE = z.enum(['USER', 'ADMIN'])

export const userSchema = z.object({
	id: z.uuid(),
	role: ROLE,
	name: z.string().min(1, 'Name is required'),
	birthDate: z.coerce.date(),
	gender: GENDER,
	auth: authSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createUserSchema = userSchema.pick({
	role: true,
	name: true,
	birthDate: true,
	gender: true,
})
export type CreateUserDTO = z.infer<typeof createUserSchema>

export const createUserWithAuthSchema = createUserSchema.extend({
	auth: createAuthSchema,
})
export type CreateUserWithAuthDTO = z.infer<typeof createUserWithAuthSchema>

export const updateUserSchema = createUserSchema.partial().extend({
	auth: updateAuthSchema.optional(),
})
export type UpdateUserDTO = z.infer<typeof updateUserSchema>

export const userResponseSchema = z.object({
	...userSchema.pick({
		id: true,
		name: true,
		role: true,
		gender: true,
		birthDate: true,
	}).shape,
	email: authSchema.shape.email,
	hasBodyMetrics: z.boolean(),
})
export type UserResponseDTO = z.infer<typeof userResponseSchema>

export interface InternalAuthResponse {
	user: UserResponseDTO
	token: string
}
