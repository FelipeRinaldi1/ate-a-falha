import { BASE_API_URL } from '@/constants/global/baseURL.js'
import path from 'node:path'

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { pinoHttp } from 'pino-http'

import { prisma } from '@/database/index.js'
import { corsOptions } from './config/cors.js'
import { logger } from './config/logger.js'
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

app.use(`${BASE_API_URL}/assets/exercises`, express.static(path.resolve(process.cwd(), 'public/exercises')))

app.use(`${BASE_API_URL}/users`, userModuleRouter)
app.use(`${BASE_API_URL}/nutrition`, nutritionModuleRouter)
app.use(`${BASE_API_URL}/workout`, workoutModuleRouter)

app.get(`${BASE_API_URL}/`, (_req, res) => {
	res.send('Até-a-falha API On')
})

app.use(globalErrorHandler)

export default app
