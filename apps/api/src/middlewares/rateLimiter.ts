import rateLimit from 'express-rate-limit'
import { HTTP_STATUS } from '../constants/global/httpCodesConstants.js'

export const apiRateLimiter = rateLimit({
	windowMs: 15 * 6 * 1000, // 15min
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		status: 'error',
		message: 'Too many requests from this IP, try again later',
	},
	statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
})
