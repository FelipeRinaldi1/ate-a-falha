import dotenv from 'dotenv'
import path from 'node:path'
import { z } from 'zod'

dotenv.config({ path: path.resolve(process.cwd(), '../../.env') })
import { NODE_ENV, DEFAULT_JWT_EXPIRES, DEFAULT_PORT } from '../constants/env/env.constants.js'
import { ENV_ERRORS } from '../constants/env/env.errors.js'

const nodeEnvValues = Object.values(NODE_ENV) as [string, ...string[]]

const envSchema = z.object({
	NODE_ENV: z
		.enum(nodeEnvValues, {
			message: ENV_ERRORS.NODE_ENV_INVALID,
		})
		.default(NODE_ENV.DEVELOPMENT),

	PORT: z.coerce.number().default(DEFAULT_PORT),

	JWT_SECRET: z.string().min(1, { message: ENV_ERRORS.JWT_SECRET_MISSING }),

	JWT_EXPIRES_IN: z.string().default(DEFAULT_JWT_EXPIRES),

	CORS_ORIGIN: z.string().default('*'),

	SERVER_URL: z.url({ message: 'URL do servidor inválida' }).default('http://localhost:3333'),

	LOG_LEVEL: z.string().default('info'),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	const formattedErrors = z.treeifyError(_env.error)

	console.error(`${ENV_ERRORS.INVALID_VARIABRLES}:`, JSON.stringify(formattedErrors, null, 2))

	throw new Error(ENV_ERRORS.FATAL_ERROR)
}

export const ENV = _env.data
