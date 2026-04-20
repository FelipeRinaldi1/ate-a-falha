import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { success, failure, Result } from '@ate-a-falha/shared'

const tokenPayloadSchema = z.object({
	sub: z.uuid(),
})

export type TokenPayload = z.infer<typeof tokenPayloadSchema>

export const validateToken = (token: string, secret: string): Result<TokenPayload> => {
	try {
		const decoded = jwt.verify(token, secret)
		const validation = tokenPayloadSchema.safeParse(decoded)

		if (!validation.success) {
			return failure({
				type: 'UNAUTHORIZED',
				message: 'Invalid token payload',
				details: validation.error.issues,
			})
		}

		return success(validation.data)
	} catch (error: any) {
		return failure({
			type: 'UNAUTHORIZED',
			message: 'Invalid or expired token',
			details: error?.message,
		})
	}
}
