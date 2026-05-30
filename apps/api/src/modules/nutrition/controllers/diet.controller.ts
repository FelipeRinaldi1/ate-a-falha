import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'
import { DietService } from '../services/diet.service.js'
import {
	createDietSchema,
	updateDietSchema,
	createDietLogSchema,
	updateDietLogSchema,
	validateData,
} from '@ate-a-falha/shared'

export class DietController {
	constructor(private readonly dietService: DietService) {}

	// Diet Plan CRUD
	create = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(createDietSchema, req.body, 'Invalid Request Body')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.create(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.dietService.findAll(req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid diet ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.findById(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid diet ID in URL')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateDietSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.dietService.update(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid diet ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.delete(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	// DietLog Real Consumption CRUD
	createLog = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(createDietLogSchema, req.body, 'Invalid Request Body')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.createLog(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAllLogs = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.dietService.findAllLogs(req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findLogById = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid diet log ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.findLogById(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	updateLog = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid diet log ID in URL')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateDietLogSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.dietService.updateLog(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	deleteLog = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid diet log ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.deleteLog(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
