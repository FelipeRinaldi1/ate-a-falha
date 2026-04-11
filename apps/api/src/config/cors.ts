import { CorsOptions } from 'cors'
import { ENV } from './env.js'

export const corsOptions: CorsOptions = {
	origin: ENV.CORS_ORIGIN,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}
