import { Request, Response, NextFunction } from 'express'
import { AppError } from '@ate-a-falha/shared'
function isAppError(err: unknown): err is AppError {
	return typeof err === 'object' && err !== null && 'type' in err && 'message' in err
}

export function globalErrorHandler(
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	const statusMap: Record<AppError['type'], number> = {
		VALIDATION: 400,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		CONFLICT: 409,
		DATABASE_ERROR: 500,
	}

	if (isAppError(err)) {
		const statusCode = statusMap[err.type] || 500

		req.log.warn({ type: err.type, message: err.message }, 'Controlled application error')

		return res.status(statusCode).json({
			status: 'error',
			code: err.type,
			message: err.message,
			details: err.details ?? null,
		})
	}

	req.log.error(err as any, 'Unhandled unexpected error')

	return res.status(500).json({
		status: 'error',
		code: 'INTERNAL_SERVER_ERROR',
		message: 'An unexpected error occurred on the server.',
	})
}
