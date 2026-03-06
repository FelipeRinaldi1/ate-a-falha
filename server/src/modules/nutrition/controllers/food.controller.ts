import { Request, Response, NextFunction } from 'express'
import { FoodService } from '../services/food.service.js'
import { createFoodSchema, foodSearchSchema, updateFoodSchema } from '../DTOs/food.schema.js'
import { z } from 'zod'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'

export class FoodController {
	constructor(private foodService: FoodService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const data = createFoodSchema.parse(req.body)
		const userId = z.uuid().parse(req.user?.id)
		const result = await this.foodService.create(data, userId)

		if (result.isFailure()) {
			return next(result.error)
		}

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}
	findById = async (req: Request, res: Response, next: NextFunction) => {
		const id = z.uuid().parse(req.params)
		const userId = z.uuid().parse(req.user.id)
		const result = await this.foodService.findById(id, userId)

		if (result.isFailure()) {
			return next(result.error)
		}
		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const data = foodSearchSchema.parse(req.body)
		const userId = z.uuid().parse(req.user.id)
		const result = await this.foodService.findAll(data, userId)

		if (result.isFailure()) {
			return next(result.error)
		}
		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const id = z.uuid().parse(req.params)
		const data = updateFoodSchema.parse(req.body)
		const userId = z.uuid().parse(req.user.id)
		const result = await this.foodService.update(id, data, userId)

		if (result.isFailure()) {
			return next(result.error)
		}
		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const id = z.uuid().parse(req.params)
		const userId = z.uuid().parse(req.user.id)
		const result = await this.foodService.delete(id, userId)

		if (result.isFailure()) {
			return next(result.error)
		}
		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
