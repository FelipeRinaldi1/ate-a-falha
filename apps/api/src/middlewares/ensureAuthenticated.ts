import { Request, Response, NextFunction } from 'express'
import { AppError } from '@ate-a-falha/shared'
import { prisma, safeCall } from '@ate-a-falha/database'
import { validateToken } from '../utils/validateToken.js'
import { ENV } from '../config/env.js'

export const ensureAuthenticated = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

		if (!token) {
			return next({ type: 'UNAUTHORIZED', message: 'Token not provided' } as AppError)
		}

		const result = validateToken(token, ENV.JWT_SECRET)

		if (result.isFailure()) {
			return next(result.error)
		}

		const userId = result.value.sub

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
