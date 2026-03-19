import { Request, Response, NextFunction } from 'express'
import { FoodService } from '../services/food.service.js'
import { createFoodSchema, foodSearchSchema, updateFoodSchema } from '../DTOs/food.schema.js'
import { z } from 'zod'
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'
import { validateData } from '@/@utils/validateData.js'

export class FoodController {
	constructor(private foodService: FoodService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(createFoodSchema, req.body, 'Invalid request body')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.foodService.create(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid food ID parameter')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.foodService.findById(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(foodSearchSchema, req.query, 'Invalid search parameters')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.foodService.findAll(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid food ID in URL')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateFoodSchema, req.body, 'Invalid update data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.foodService.update(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid food ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.foodService.delete(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
