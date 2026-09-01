import type { Request, Response, NextFunction } from 'express'
import { NotificationService } from '../services/notification.service.js'
import {
	createNotificationSchema,
	notificationSearchSchema,
	validateData,
} from '@ate-a-falha/shared'
import { z } from 'zod'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'

export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(createNotificationSchema, req.body, 'Invalid notification data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.notificationService.create(bodyValidation.value, req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const queryValidation = validateData(notificationSearchSchema, req.query, 'Invalid search parameters')
		if (queryValidation.isFailure()) return next(queryValidation.error)

		const result = await this.notificationService.findAll(queryValidation.value, req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.notificationService.getUnreadCount(req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid notification ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.notificationService.findById(idValidation.value, req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	markAsRead = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid notification ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.notificationService.markAsRead(idValidation.value, req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.notificationService.markAllAsRead(req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid notification ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.notificationService.delete(idValidation.value, req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	deleteAll = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.notificationService.deleteAll(req.user)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
