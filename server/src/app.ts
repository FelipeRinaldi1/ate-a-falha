import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors.js'
import { pinoHttp } from 'pino-http'
import { logger } from './config/logger.js'
import 'dotenv/config'
import helmet from 'helmet'
import { apiRateLimiter } from './@middlewares/rateLimiter.js'
import * as swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { foodRoutes } from './modules/nutrition/routers/food.routes.js'
import { bodyMetricRoutes } from './modules/user/routers/bodyMetric.router.js'
import { userRoutes } from './modules/user/routers/user.router.js'
import { globalErrorHandler } from './@middlewares/globalErrorHandler.js'

const app = express()

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(apiRateLimiter)

app.use(pinoHttp({ logger }))

app.use(express.json())

//Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/foods', foodRoutes)
app.use('/body-metrics', bodyMetricRoutes)
app.use('/users', userRoutes)

app.get('/', (_req, res) => {
	res.send('Hello World!')
})

app.use(globalErrorHandler)

export default app
