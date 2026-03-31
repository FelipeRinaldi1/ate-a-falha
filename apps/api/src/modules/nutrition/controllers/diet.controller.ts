import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { HTTP_STATUS } from 'apps/api/src/@constants/global/httpCodesConstants.js'
import { DietService } from '../services/diet.service.js'
import { validateData } from "@ate-a-falha/shared"

import { createDietSchema, updateDietSchema } from "@ate-a-falha/shared"


export class DietController {
	constructor(private dietService: DietService) { }

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
		const validation = validateData(z.string().uuid(), req.params.id, 'Invalid diet ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.findById(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.string().uuid(), req.params.id, 'Invalid diet ID in URL')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateDietSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.dietService.update(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.string().uuid(), req.params.id, 'Invalid diet ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.delete(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
