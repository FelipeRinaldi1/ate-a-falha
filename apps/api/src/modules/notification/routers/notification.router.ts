import { Router } from 'express'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'
import { NotificationRepository } from '../repositories/notification.repository.js'
import { NotificationService } from '../services/notification.service.js'
import { NotificationController } from '../controllers/notification.controller.js'

const notificationRouter = Router()
const notificationRepo = new NotificationRepository()
const notificationService = new NotificationService(notificationRepo)
const notificationController = new NotificationController(notificationService)

notificationRouter.use(ensureAuthenticated)

notificationRouter.post('/', notificationController.create)
notificationRouter.get('/', notificationController.findAll)
notificationRouter.get('/unread-count', notificationController.getUnreadCount)
notificationRouter.patch('/mark-all-read', notificationController.markAllAsRead)
notificationRouter.delete('/', notificationController.deleteAll)

notificationRouter.get('/:id', notificationController.findById)
notificationRouter.patch('/:id/read', notificationController.markAsRead)
notificationRouter.delete('/:id', notificationController.delete)

export { notificationRouter }
