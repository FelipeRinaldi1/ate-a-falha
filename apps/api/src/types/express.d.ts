import { Logger } from 'pino'

export {}

declare global {
	namespace Express {
		interface Request {
			log: Logger
			user: {
				id: string
				role: 'USER' | 'ADMIN'
			}
		}
	}
}
