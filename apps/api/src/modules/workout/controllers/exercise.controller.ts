import { Request, Response, NextFunction } from 'express'
import { ExerciseService } from '../services/exercise.service.js'
import { createexerciseSchema, searchexerciseSchema, updateexerciseSchema } from "@ate-a-falha/shared"

import { validateData } from "@ate-a-falha/shared"

import { HTTP_STATUS } from 'apps/api/src/constants/global/httpCodesConstants.js'
import { z } from 'zod'

export class ExerciseController {
	constructor(private exerciseService: ExerciseService) { }

	create = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(createexerciseSchema, req.body, 'Invalid Request Body')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.exerciseService.create(validation.value, req.user!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid exercise ID')

		if (idValid.isFailure()) return next(idValid.error)

		const validation = validateData(updateexerciseSchema, req.body, 'Invalid update Body')

		if (validation.isFailure()) return next(validation.error)

		const id = idValid.value
		const data = validation.value

		const result = await this.exerciseService.update(id, data, req.user!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid Exercise Id')

		if (idValid.isFailure()) return next(idValid.error)

		const id = idValid.value

		const result = await this.exerciseService.delete(id, req.user!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(searchexerciseSchema, req.query, 'Invalid search Data')

		if (validation.isFailure()) return next(validation.error)

		const data = validation.value

		const result = await this.exerciseService.findAll(data)
		if (result.isFailure()) return next(result.error)
		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid exercise ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.exerciseService.findById(idValid.value)
		if (result.isFailure()) return next(result.error)
		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
