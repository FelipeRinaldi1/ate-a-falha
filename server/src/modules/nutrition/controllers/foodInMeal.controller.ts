import { Request, Response, NextFunction } from 'express'
import { FoodInMealService } from '../services/foodInMeal.service.js'
import { CreateFoodInMealSchema, UpdateFoodInMealSchema } from '../DTOs/foodInMeal.schema.js'
import { z } from 'zod'
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'
import { validateData } from '@/@utils/validateData.js'

export class FoodInMealController {
    constructor(private foodInMealService: FoodInMealService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const mealIdValidation = validateData(z.uuid(), req.params.mealId, 'ID da refeição inválido')
        if (mealIdValidation.isFailure()) return next(mealIdValidation.error)

        const foodIdValidation = validateData(z.uuid(), req.params.foodId, 'ID do alimento inválido')
        if (foodIdValidation.isFailure()) return next(foodIdValidation.error)

        const bodyValidation = validateData(CreateFoodInMealSchema, req.body, 'Dados de quantidade inválidos')
        if (bodyValidation.isFailure()) return next(bodyValidation.error)

        const result = await this.foodInMealService.create(
            mealIdValidation.value,
            foodIdValidation.value,
            bodyValidation.value,
            req.user
        )

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.CREATED).json(result.value)
    }

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        const mealIdValidation = validateData(z.uuid(), req.params.mealId, 'ID da refeição inválido')
        if (mealIdValidation.isFailure()) return next(mealIdValidation.error)

        const result = await this.foodInMealService.findAll(mealIdValidation.value, req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        const idValidation = validateData(z.uuid(), req.params.id, 'ID do item inválido')
        if (idValidation.isFailure()) return next(idValidation.error)

        const result = await this.foodInMealService.findById(idValidation.value, req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        const idValidation = validateData(z.uuid(), req.params.id, 'ID do item inválido')
        if (idValidation.isFailure()) return next(idValidation.error)

        const bodyValidation = validateData(UpdateFoodInMealSchema, req.body, 'Dados de atualização inválidos')
        if (bodyValidation.isFailure()) return next(bodyValidation.error)

        const result = await this.foodInMealService.update(idValidation.value, bodyValidation.value, req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const idValidation = validateData(z.uuid(), req.params.id, 'ID do item inválido')
        if (idValidation.isFailure()) return next(idValidation.error)

        const result = await this.foodInMealService.delete(idValidation.value, req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }
}
