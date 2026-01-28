import 'dotenv/config'
import {z} from 'zod'
import { NODE_ENV, DEFAULT_JWT_EXPIRES,DEFAULT_PORT} from '../@constants/env/env.constants.js'
import { ENV_ERRORS } from '../@constants/env/env.errors.js'

const envSchema=z.object({
    NODE_ENV: z.enum(NODE_ENV,{
        error: ENV_ERRORS.NODE_ENV_INVALID
    }).default(NODE_ENV.DEVELOPMENT),

    PORT: z.coerce.number({error:ENV_ERRORS.PORT_INVALID}).default(DEFAULT_PORT),

    JWT_SECRET: z.string().min(1,{error:ENV_ERRORS.JWT_SECRET_MISSING}),

    JWT_EXPIRES_IN: z.string().default(DEFAULT_JWT_EXPIRES),

    CORS_ORIGIN: z.string().default('*'),

    SERVER_URL: z.string(),

    LOG_LEVEL :z.string()
})

const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error(ENV_ERRORS.INVALID_VARIABRLES,_env.error.format)

    throw new Error(ENV_ERRORS.FATAL_ERROR)
}

export const ENV = _env.data;