import express from 'express'
import cors from 'cors'
import { prisma } from '@ate-a-falha/database'
import { corsOptions } from './config/cors.js'
import { pinoHttp } from 'pino-http'
import { logger } from './config/logger.js'
import 'dotenv/config'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { apiRateLimiter } from './middlewares/rateLimiter.js'
import * as swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { userRouter } from './modules/user/routers/user.router.js'
import { dietRouter } from './modules/nutrition/routers/diet.router.js'
import { mealRouter } from './modules/nutrition/routers/meal.router.js'
import { foodRoutes } from './modules/nutrition/routers/food.router.js'
import { foodInMealRouter } from './modules/nutrition/routers/foodInMeal.router.js'
import { planRouter } from './modules/workout/routers/plan.router.js'
import { workoutRouter } from './modules/workout/routers/workout.router.js'
import { workoutExerciseRouter } from './modules/workout/routers/workoutExercise.router.js'
import { setRouter } from './modules/workout/routers/set.router.js'
import { exerciseRouter } from './modules/workout/routers/exercise.router.js'
import { globalErrorHandler } from './middlewares/globalErrorHandler.js'

const app = express()

app.use('/assets/exercises', express.static(process.env.ASSETS_EXERCISES_PATH))

// Logger (First to catch everything)
app.use(pinoHttp({ logger }))

// Security & Infrastructure
app.use(helmet())
app.use(cors(corsOptions))
app.use(apiRateLimiter)
app.use(express.json())
app.use(cookieParser())

// Public Health Check
app.get('/health', async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`
		res.status(200).json({ status: 'ok', database: 'connected' })
	} catch (error) {
		res.status(500).json({ status: 'error', database: 'disconnected' })
	}
})

// Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/users', userRouter)

// Nutrition Routes
app.use('/diets', dietRouter)
app.use('/foods', foodRoutes)
app.use('/', mealRouter)
app.use('/', foodInMealRouter)

// Workout Routes
app.use('/plans', planRouter)
app.use('/exercises', exerciseRouter)
app.use('/', setRouter)
app.use('/', workoutRouter)
app.use('/', workoutExerciseRouter)

app.get('/', (_req, res) => {
	res.send('Hello World!')
})

app.use(globalErrorHandler)

export default app
