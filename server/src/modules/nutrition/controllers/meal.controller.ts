import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'
import { MealService } from '../services/meal.service.js'
import { validateData } from '@/@utils/validateData.js'
import { CreateMealSchema, UpdateMealSchema } from '../DTOs/meal.schema.js'

export class MealController {
	constructor(private mealService: MealService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const dietIdValidation = validateData(z.uuid(), req.params.dietId, 'Invalid diet ID')
		if (dietIdValidation.isFailure()) return next(dietIdValidation.error)

		const bodyValidation = validateData(CreateMealSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.mealService.create(dietIdValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const dietIdValidation = validateData(z.uuid(), req.params.dietId, 'Invalid diet ID')
		if (dietIdValidation.isFailure()) return next(dietIdValidation.error)

		const result = await this.mealService.findAll(dietIdValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid meal ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.mealService.findById(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid meal ID in URL')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(UpdateMealSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.mealService.update(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid meal ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.mealService.delete(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
