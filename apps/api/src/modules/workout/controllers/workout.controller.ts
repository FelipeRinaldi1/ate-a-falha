import { Request, Response, NextFunction } from 'express'
import { WorkoutService } from '../services/workout.service.js'
import { validateData } from '@ate-a-falha/shared'

import { createworkoutSchema, updateworkoutSchema } from '@ate-a-falha/shared'

import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'
import { z } from 'zod'

export class WorkoutController {
	constructor(private workoutService: WorkoutService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const planIdValid = validateData(z.uuid(), req.params.planId, 'Invalid Plan ID')
		if (planIdValid.isFailure()) return next(planIdValid.error)

		const bodyValidation = validateData(createworkoutSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.workoutService.create(planIdValid.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid workout ID')
		if (idValid.isFailure()) return next(idValid.error)

		const bodyValidation = validateData(updateworkoutSchema, req.body, 'Invalid update Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.workoutService.update(idValid.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid workout ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.workoutService.delete(idValid.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).send() // Geralmente delete retorna vazio ou status OK
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const planIdValid = validateData(z.uuid(), req.params.planId, 'Invalid Plan ID')
		if (planIdValid.isFailure()) return next(planIdValid.error)

		const result = await this.workoutService.findAll(planIdValid.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid workout ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.workoutService.findById(idValid.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
