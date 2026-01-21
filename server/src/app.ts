import express from 'express'
import cors from 'cors'
import authRouter from './modules/auth/auth.routes.js';
import { globalErrorHandler } from './middlewares/globalErrorHandlerMiddleware.js';
import 'dotenv/config'

const app = express();

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use('/api/auth', authRouter);

app.use(globalErrorHandler)

app.get('/',(req,res)=>{
        res.send('Hello World!')
})


export default app