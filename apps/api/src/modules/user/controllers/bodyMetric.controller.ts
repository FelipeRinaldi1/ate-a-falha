import { Request, Response, NextFunction } from 'express'
import { BodyMetricService } from '../services/bodyMetric.service.js'
import { createBodyMetricSchema, updateBodyMetricSchema, bodyMetricSearchSchema } from "@ate-a-falha/shared"

import { z } from 'zod'
import { HTTP_STATUS } from 'apps/api/src/constants/global/httpCodesConstants.js'
import { validateData } from "@ate-a-falha/shared"


export class BodyMetricController {
	constructor(private bodyMetricService: BodyMetricService) { }

	create = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(createBodyMetricSchema, req.body, 'Invalid body metric data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.bodyMetricService.create(bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const queryValidation = validateData(bodyMetricSearchSchema, req.query, 'Invalid search parameters')
		if (queryValidation.isFailure()) return next(queryValidation.error)

		const result = await this.bodyMetricService.findAll(queryValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid body metric ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.bodyMetricService.findById(idValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid body metric ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateBodyMetricSchema, req.body, 'Invalid update data for body metric')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.bodyMetricService.update(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid body metric ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.bodyMetricService.delete(idValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
