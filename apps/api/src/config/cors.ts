import { CorsOptions } from 'cors'
import { ENV } from './env.js'

const allowedOrigins = ENV.CORS_ORIGIN.split(',').map((o) => o.trim().replace(/\/$/, ''))

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		const cleanOrigin = origin ? origin.replace(/\/$/, '') : ''

		const isLocalDev =
			ENV.NODE_ENV === 'development' &&
			origin &&
			(origin.startsWith('http://localhost') ||
				origin.startsWith('https://localhost') ||
				origin.startsWith('http://127.0.0.1') ||
				origin.startsWith('https://127.0.0.1') ||
				origin.includes('192.168.') ||
				origin.includes('10.') ||
				origin.includes('100.') ||
				origin.includes('172.'))

		const isVercelPreview = origin && origin.endsWith('.vercel.app')

		if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(cleanOrigin) || isLocalDev || isVercelPreview) {
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
