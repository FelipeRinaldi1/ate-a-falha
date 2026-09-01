import { Router } from 'express'
import { notificationRouter } from './notification.router.js'

const notificationModuleRouter = Router()

notificationModuleRouter.use('/', notificationRouter)

export { notificationModuleRouter }
