import { Request, Response, NextFunction } from 'express'
import { PlanService } from '../services/plan.service.js'
import { validateData } from "@ate-a-falha/shared"

import { createplanSchema, updateplanSchema } from "@ate-a-falha/shared"

import { HTTP_STATUS } from 'apps/api/src/@constants/global/httpCodesConstants.js'
import { z } from 'zod'

export class PlanController {
	constructor(private planService: PlanService) { }
	create = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(createplanSchema, req.body, 'Invalid Request Body')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.planService.create(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.string().uuid(), req.params.id, 'Invalid exercise ID')

		if (idValid.isFailure()) return next(idValid.error)

		const validation = validateData(updateplanSchema, req.body, 'Invalid update Body')

		if (validation.isFailure()) return next(validation.error)

		const id = idValid.value
		const data = validation.value

		const result = await this.planService.update(id, data, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.string().uuid(), req.params.id, 'Invalid Exercise Id')

		if (idValid.isFailure()) return next(idValid.error)

		const id = idValid.value

		const result = await this.planService.delete(id, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.planService.findAll(req.user)
		if (result.isFailure()) return next(result.error)
		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.string().uuid(), req.params.id, 'Invalid exercise ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.planService.findById(idValid.value, req.user)
		if (result.isFailure()) return next(result.error)
		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
