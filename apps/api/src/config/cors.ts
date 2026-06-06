import { CorsOptions } from 'cors'
import { ENV } from './env.js'

const allowedOrigins = ENV.CORS_ORIGIN.split(',').map((o) => o.trim())

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		const isLocalDev = ENV.NODE_ENV === 'development' && origin && (
			origin.startsWith('http://localhost') ||
			origin.startsWith('https://localhost') ||
			origin.startsWith('http://127.0.0.1') ||
			origin.startsWith('https://127.0.0.1') ||
			origin.includes('192.168.') ||
			origin.includes('10.') ||
			origin.includes('100.')
		)

		if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || isLocalDev) {
			callback(null, true)
		} else {
			console.warn(`[CORS] Blocked request. Origin not allowed: ${origin}`)
			callback(new Error('Not allowed by CORS'))
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}
