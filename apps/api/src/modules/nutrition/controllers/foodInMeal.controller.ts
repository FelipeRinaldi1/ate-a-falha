import type { Request, Response, NextFunction } from 'express'
import { FoodInMealService } from '../services/foodInMeal.service.js'
import {
	createFoodInMealSchema,
	updateFoodInMealSchema,
	createFoodLogSchema,
	updateFoodLogSchema,
	validateData,
} from '@ate-a-falha/shared'
import { z } from 'zod'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'

export class FoodInMealController {
	constructor(private readonly foodInMealService: FoodInMealService) {}

	// FoodInMeal Plan CRUD
	create = async (req: Request, res: Response, next: NextFunction) => {
		const mealIdValidation = validateData(z.uuid(), req.params.mealId, 'Invalid meal ID')
		if (mealIdValidation.isFailure()) return next(mealIdValidation.error)

		const bodyValidation = validateData(createFoodInMealSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.foodInMealService.create(
			mealIdValidation.value,
			bodyValidation.value.foodId,
			bodyValidation.value,
			req.user
		)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const mealIdValidation = validateData(z.uuid(), req.params.mealId, 'Invalid meal ID')
		if (mealIdValidation.isFailure()) return next(mealIdValidation.error)

		const result = await this.foodInMealService.findAll(mealIdValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid item ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.foodInMealService.findById(idValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid item ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateFoodInMealSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.foodInMealService.update(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid item ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.foodInMealService.delete(idValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	// FoodLog Real Consumption CRUD
	createLog = async (req: Request, res: Response, next: NextFunction) => {
		const mealLogIdValidation = validateData(z.uuid(), req.params.mealLogId, 'Invalid meal log ID')
		if (mealLogIdValidation.isFailure()) return next(mealLogIdValidation.error)

		const bodyValidation = validateData(createFoodLogSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.foodInMealService.createLog(
			mealLogIdValidation.value,
			bodyValidation.value.foodId,
			bodyValidation.value,
			req.user
		)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAllLogs = async (req: Request, res: Response, next: NextFunction) => {
		const mealLogIdValidation = validateData(z.uuid(), req.params.mealLogId, 'Invalid meal log ID')
		if (mealLogIdValidation.isFailure()) return next(mealLogIdValidation.error)

		const result = await this.foodInMealService.findAllLogs(mealLogIdValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findLogById = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid item ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.foodInMealService.findLogById(idValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	updateLog = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid item ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateFoodLogSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.foodInMealService.updateLog(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	deleteLog = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid item ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.foodInMealService.deleteLog(idValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
