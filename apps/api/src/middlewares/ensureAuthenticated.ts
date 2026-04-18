import { Request, Response, NextFunction } from 'express'
import { AppError } from '@ate-a-falha/shared'
import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { validateToken } from '@ate-a-falha/shared'

export const ensureAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization

		if (!authHeader) {
			return next({ type: 'UNAUTHORIZED', message: 'Token not provided' } as AppError)
		}

		const [scheme, token] = authHeader.split(' ')

		if (scheme !== 'Bearer' || !token) {
			return next({ type: 'UNAUTHORIZED', message: 'Token malformatted' } as AppError)
		}

		const result = validateToken(token, process.env.JWT_SECRET!)

		if (!result.success) {
			return next({
				type: 'UNAUTHORIZED',
				message: 'Invalid or expired token',
				details: result.error.issues,
			} as AppError)
		}

		const { sub: userId } = result.data

		const userResult = await safeCall(
			prisma.user.findUniqueOrThrow({
				where: { id: userId },
				select: { id: true, role: true },
			})
		)

		if (userResult.isFailure()) {
			return next(userResult.error)
		}

		req.user = {
			id: userResult.value.id,
			role: userResult.value.role as 'USER' | 'ADMIN',
		}

		return next()
	} catch (error: any) {
		req.log.error({ err: error }, 'Unhandled auth error')

		const fallbackError: AppError = {
			type: 'UNAUTHORIZED',
			message: 'Authentication failed due to an unexpected error',
			details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
		}

		return next(fallbackError)
	}
}
