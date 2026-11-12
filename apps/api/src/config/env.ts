import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

const apiRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const testEnvPath = path.resolve(apiRootDir, '.env.test')
const defaultEnvPath = path.resolve(apiRootDir, '.env')
const envPath = process.env.NODE_ENV === 'test' && fs.existsSync(testEnvPath) ? testEnvPath : defaultEnvPath
const myEnv = dotenv.config({ path: envPath })
expand(myEnv)

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

	LOG_LEVEL: z.string().default('info'),

	ASSETS_EXERCISES_PATH: z.string().optional(),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
	console.error(`${ENV_ERRORS.INVALID_VARIABRLES}:`, z.treeifyError(_env.error))

	throw new Error(ENV_ERRORS.FATAL_ERROR)
}

export const ENV = _env.data
