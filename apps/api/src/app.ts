import { BASE_API_URL } from '@/constants/global/baseURL.js'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { pinoHttp } from 'pino-http'

import { prisma } from '@ate-a-falha/database'
import { corsOptions } from './config/cors.js'
import { logger } from './config/logger.js'
import { apiRateLimiter } from './middlewares/rateLimiter.js'
import { globalErrorHandler } from './middlewares/globalErrorHandler.js'

import { userModuleRouter } from './modules/user/routers/index.js'
import { nutritionModuleRouter } from './modules/nutrition/routers/index.js'
import { workoutModuleRouter } from './modules/workout/routers/index.js'
import { notificationModuleRouter } from './modules/notification/routers/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(pinoHttp({ logger }))
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors(corsOptions))
app.use(apiRateLimiter)
app.use(express.json())
app.use(cookieParser())

app.get(['/health', `${BASE_API_URL}/health`], async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`
		res.status(200).json({ status: 'ok', database: 'connected' })
	} catch (error) {
		res.status(500).json({ status: 'error', database: 'disconnected' })
	}
})

function resolveExercisesAssetsPath(): string {
	if (process.env.ASSETS_EXERCISES_PATH && fs.existsSync(process.env.ASSETS_EXERCISES_PATH)) {
		return path.resolve(process.env.ASSETS_EXERCISES_PATH)
	}

	const candidates = [
		path.resolve(__dirname, '../public/exercises'),
		path.resolve(__dirname, '../../public/exercises'),
		path.resolve(process.cwd(), 'apps/api/public/exercises'),
		path.resolve(process.cwd(), 'public/exercises'),
	]

	for (const candidate of candidates) {
		if (fs.existsSync(candidate)) {
			return candidate
		}
	}

	return path.resolve(__dirname, '../public/exercises')
}

const exercisesAssetsPath = resolveExercisesAssetsPath()
if (!fs.existsSync(exercisesAssetsPath)) {
	logger.warn(`[Assets] Diretório de imagens de exercícios não encontrado em: ${exercisesAssetsPath}`)
} else {
	logger.info(`[Assets] Servindo imagens de exercícios a partir de: ${exercisesAssetsPath}`)
}

app.use(`${BASE_API_URL}/assets/exercises`, express.static(exercisesAssetsPath))

app.use(`${BASE_API_URL}/users`, userModuleRouter)
app.use(`${BASE_API_URL}/nutrition`, nutritionModuleRouter)
app.use(`${BASE_API_URL}/workout`, workoutModuleRouter)
app.use(`${BASE_API_URL}/notifications`, notificationModuleRouter)

app.get(`${BASE_API_URL}/`, (_req, res) => {
	res.send('Até-a-falha API On')
})

app.use(globalErrorHandler)

export default app
