import { Request, Response, NextFunction } from 'express'
import { SetService } from '../services/set.service.js'
import { validateData } from '@/@utils/validateData.js'
import { CreateSetSchema, UpdateSetSchema } from '../DTOs/set.schema.js'
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'
import { z } from 'zod'

export class SetController {
	constructor(private setService: SetService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const exerciseIdValid = validateData(z.uuid(), req.params.workoutExerciseId, 'Invalid Workout Exercise ID')
		if (exerciseIdValid.isFailure()) return next(exerciseIdValid.error)

		const bodyValidation = validateData(CreateSetSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.setService.create(bodyValidation.value, exerciseIdValid.value, req.user.id!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid set ID')
		if (idValid.isFailure()) return next(idValid.error)

		const bodyValidation = validateData(UpdateSetSchema, req.body, 'Invalid update Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.setService.update(idValid.value, bodyValidation.value, req.user.id!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid set ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.setService.delete(idValid.value, req.user.id!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const exerciseIdValid = validateData(z.uuid(), req.params.workoutExerciseId, 'Invalid Workout Exercise ID')
		if (exerciseIdValid.isFailure()) return next(exerciseIdValid.error)

		const result = await this.setService.findAll(exerciseIdValid.value, req.user.id!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid set ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.setService.findById(idValid.value, req.user.id!)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
