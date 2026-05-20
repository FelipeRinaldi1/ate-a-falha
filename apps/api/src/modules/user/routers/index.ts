import { Router } from 'express'
import { userRouter } from './user.router.js'
import { bodyMetricRouter } from './bodyMetric.router.js'

const userModuleRouter = Router()

userModuleRouter.use('/', userRouter)
userModuleRouter.use('/', bodyMetricRouter)

export { userModuleRouter }
