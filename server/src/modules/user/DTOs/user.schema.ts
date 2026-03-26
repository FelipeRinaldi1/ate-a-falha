import { z } from 'zod'
import { createAuthSchema, updateAuthSchema } from './auth.schema.js'

export const GENDER = z.enum(["MALE", "FEMALE", "OTHER"])
export const ROLE = z.enum(["USER", "ADMIN"])

export const createUserSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	birthDate: z.coerce.date(),
	gender: GENDER,
	role: ROLE.default("USER"),
})

export const createUserWithAuthSchema = createUserSchema.extend({
	auth: createAuthSchema,
})

export const updateUserSchema = createUserSchema.partial().extend({
	auth: updateAuthSchema.optional(),
})

export type createUserDTO = z.infer<typeof createUserSchema>
export type createUserWithAuthDTO = z.infer<typeof createUserWithAuthSchema>
export type updateUserDTO = z.infer<typeof updateUserSchema>
