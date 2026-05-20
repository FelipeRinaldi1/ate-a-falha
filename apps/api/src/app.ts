import { BASE_API_URL } from '@/constants/global/baseURL.js'

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import * as swaggerUi from 'swagger-ui-express'
import { pinoHttp } from 'pino-http'

import { prisma } from '@ate-a-falha/database'
import { corsOptions } from './config/cors.js'
import { logger } from './config/logger.js'
import { swaggerSpec } from './config/swagger.js'
import { apiRateLimiter } from './middlewares/rateLimiter.js'
import { globalErrorHandler } from './middlewares/globalErrorHandler.js'

import { userModuleRouter } from './modules/user/routers/index.js'
import { nutritionModuleRouter } from './modules/nutrition/routers/index.js'
import { workoutModuleRouter } from './modules/workout/routers/index.js'

const app = express()

app.use(pinoHttp({ logger }))
app.use(helmet())
app.use(cors(corsOptions))
app.use(apiRateLimiter)
app.use(express.json())
app.use(cookieParser())

app.get('/health', async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`
		res.status(200).json({ status: 'ok', database: 'connected' })
	} catch (error) {
		res.status(500).json({ status: 'error', database: 'disconnected' })
	}
})

if (process.env.ASSETS_EXERCISES_PATH) {
	app.use(`${BASE_API_URL}/assets/exercises`, express.static(process.env.ASSETS_EXERCISES_PATH))
}
app.use(`${BASE_API_URL}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use(`${BASE_API_URL}/user`, userModuleRouter)
app.use(`${BASE_API_URL}/nutrition`, nutritionModuleRouter)
app.use(`${BASE_API_URL}/workout`, workoutModuleRouter)

app.get(`${BASE_API_URL}/`, (_req, res) => {
	res.send('Até-a-falha API On')
})

app.use(globalErrorHandler)

export default app
