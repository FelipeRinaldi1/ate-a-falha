import { Request, Response, NextFunction } from 'express'
import { AppError } from '@ate-a-falha/shared'
import { validateToken } from '../utils/validateToken.js'
import { ENV } from '../config/env.js'
import { UserRepository } from '../modules/user/repositories/user.repository.js'

const userRepository = new UserRepository()

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

		const userResult = await userRepository.findAuthContextById(userId)

		if (userResult.isFailure()) {
			if (userResult.error.type === 'NOT_FOUND') {
				return next({ type: 'UNAUTHORIZED', message: 'Invalid or expired session' } as AppError)
			}
			return next(userResult.error)
		}

		req.user = userResult.value

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
