import { CorsOptions } from 'cors'
import { ENV } from './env.js'

const allowedOrigins = ENV.CORS_ORIGIN.split(',').map((o) => o.trim())

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
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
