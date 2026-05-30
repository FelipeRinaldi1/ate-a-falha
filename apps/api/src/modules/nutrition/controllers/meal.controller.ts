import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'
import { MealService } from '../services/meal.service.js'
import {
	createMealSchema,
	updateMealSchema,
	createMealLogSchema,
	updateMealLogSchema,
	validateData,
} from '@ate-a-falha/shared'

export class MealController {
	constructor(private readonly mealService: MealService) {}

	// Meal Plan CRUD
	create = async (req: Request, res: Response, next: NextFunction) => {
		const dietIdValidation = validateData(z.uuid(), req.params.dietId, 'Invalid diet ID')
		if (dietIdValidation.isFailure()) return next(dietIdValidation.error)

		const bodyValidation = validateData(createMealSchema, req.body, 'Invalid Request Body')
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

		const bodyValidation = validateData(updateMealSchema, req.body, 'Invalid Request Body')
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

	// MealLog Real Consumption CRUD
	createLog = async (req: Request, res: Response, next: NextFunction) => {
		const dietLogIdValidation = validateData(z.uuid(), req.params.dietLogId, 'Invalid diet log ID')
		if (dietLogIdValidation.isFailure()) return next(dietLogIdValidation.error)

		const bodyValidation = validateData(createMealLogSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.mealService.createLog(dietLogIdValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAllLogs = async (req: Request, res: Response, next: NextFunction) => {
		const dietLogIdValidation = validateData(z.uuid(), req.params.dietLogId, 'Invalid diet log ID')
		if (dietLogIdValidation.isFailure()) return next(dietLogIdValidation.error)

		const result = await this.mealService.findAllLogs(dietLogIdValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findLogById = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid meal log ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.mealService.findLogById(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	updateLog = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.uuid(), req.params.id, 'Invalid meal log ID in URL')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateMealLogSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.mealService.updateLog(idValidation.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	deleteLog = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(z.uuid(), req.params.id, 'Invalid meal log ID')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.mealService.deleteLog(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
