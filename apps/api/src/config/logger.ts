import pino from 'pino'
import { ENV } from './env.js'
import { NODE_ENV } from '../constants/env/env.constants.js'

const logLevel = ENV.LOG_LEVEL || (ENV.NODE_ENV === 'test' ? 'silent' : 'info')

const usePrettyPrint = ENV.NODE_ENV === NODE_ENV.DEVELOPMENT || ENV.NODE_ENV === 'test'

export const logger = pino({
	level: logLevel,

	transport: usePrettyPrint
		? {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'SYS:standard',
					ignore: 'pid,hostname',
				},
			}
		: undefined,
})
