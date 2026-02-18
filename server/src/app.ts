import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors.js';
import {pinoHttp} from 'pino-http';
import { logger } from './config/logger.js';

import { globalErrorHandler } from './middlewares/globalErrorHandlerMiddleware.js';
import 'dotenv/config'
import helmet from 'helmet';
import { apiRateLimiter } from './middlewares/rateLimiter.js';

import * as swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js';
import { AppError } from './@utils/appError.js';

import authRouter from '././modules/auth/http/auth.routes.js'
import foodRouter from './modules/nutrition/http/food.routes.js';
import { exerciseRouter } from './modules/training/http/exercise.routes.js';
import { bodyMetricsRouter } from './modules/body-metrics/http/body-metrics.router.js';

const app = express();

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
app.use(apiRateLimiter)

app.use(pinoHttp({logger}))

app.use(express.json())

//Routes
app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use('/auth', authRouter);
app.use('/body-metrics', bodyMetricsRouter);
app.use('/foods', foodRouter);
app.use('/exercises', exerciseRouter);




app.get('/',(req,res)=>{
        res.send('Hello World!')
})

app.use((req,res,next)=>{
        next(new AppError('route not found',404))
})

app.use(globalErrorHandler)

export default app