import { CorsOptions } from 'cors'
import { ENV } from './env.js'

const allowedOrigins = ENV.CORS_ORIGIN.split(',')
	.map((o) => o.trim().replace(/\/$/, ''))
	.filter((o) => o.length > 0 && o !== '*')

if (process.env.FRONTEND_URL) {
	const cleanFrontendUrl = process.env.FRONTEND_URL.trim().replace(/\/$/, '')
	if (cleanFrontendUrl && !allowedOrigins.includes(cleanFrontendUrl)) {
		allowedOrigins.push(cleanFrontendUrl)
	}
}

const LOCAL_DEV_ORIGIN_PATTERNS = [
	/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
	/^https?:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/,
]

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin) {
			callback(null, true)
			return
		}

		const cleanOrigin = origin.replace(/\/$/, '')
		const isExplicitlyAllowed = allowedOrigins.includes(cleanOrigin)
		const isLocalDevAllowed =
			ENV.NODE_ENV !== 'production' && LOCAL_DEV_ORIGIN_PATTERNS.some((pattern) => pattern.test(cleanOrigin))

		if (isExplicitlyAllowed || isLocalDevAllowed) {
			callback(null, true)
		} else {
			console.warn(`[CORS] Blocked request. Origin not allowed: ${origin}`)
			callback(null, false)
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}
