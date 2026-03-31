import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors.js'
import { pinoHttp } from 'pino-http'
import { logger } from './config/logger.js'
import 'dotenv/config'
import helmet from 'helmet'
import { apiRateLimiter } from './middlewares/rateLimiter.js'
import * as swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'
import { userRouter } from './modules/user/routers/user.router.js'
import { globalErrorHandler } from './middlewares/globalErrorHandler.js'

const app = express()

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(apiRateLimiter)

// Logger
app.use(pinoHttp({ logger }))

app.use(express.json())

// Routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/users', userRouter)


app.get('/', (_req, res) => {
	res.send('Hello World!')
})

app.use(globalErrorHandler)

export default app
