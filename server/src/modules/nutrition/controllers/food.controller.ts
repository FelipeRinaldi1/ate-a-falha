import { Request, Response, NextFunction } from 'express'
import { FoodService } from '../services/food.service.js'
import { createFoodSchema, updateFoodSchema,foodSearchSchema } from '../DTOs/food.schema.js'
import { z } from 'zod'
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'
import { validateData } from '@/@utils/validateData.js'

export class FoodController {
    constructor(private foodService: FoodService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        const bodyValidation = validateData(createFoodSchema, req.body, 'Dados do alimento inválidos')
        if (bodyValidation.isFailure()) return next(bodyValidation.error)

        const result = await this.foodService.create(
            bodyValidation.value,
            req.user
        )

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.CREATED).json(result.value)
    }

    findAll = async (req: Request, res: Response, next: NextFunction) => {
        // Busca todos os alimentos vinculados ao usuário (ou globais, dependendo da sua Service)
        const result = await this.foodService.findAll(req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }

    findById = async (req: Request, res: Response, next: NextFunction) => {
        // Validação do UUID do alimento vindo dos parâmetros da URL
        const idValidation = validateData(z.string().uuid(), req.params.id, 'ID do alimento inválido')
        if (idValidation.isFailure()) return next(idValidation.error)

        const result = await this.foodService.findById(idValidation.value, req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }

    update = async (req: Request, res: Response, next: NextFunction) => {
        const idValidation = validateData(z.string().uuid(), req.params.id, 'ID do alimento inválido')
        if (idValidation.isFailure()) return next(idValidation.error)

        const bodyValidation = validateData(UpdateFoodSchema, req.body, 'Dados de atualização inválidos')
        if (bodyValidation.isFailure()) return next(bodyValidation.error)

        const result = await this.foodService.update(
            idValidation.value, 
            bodyValidation.value, 
            req.user
        )

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        const idValidation = validateData(z.string().uuid(), req.params.id, 'ID do alimento inválido')
        if (idValidation.isFailure()) return next(idValidation.error)

        const result = await this.foodService.delete(idValidation.value, req.user)

        if (result.isFailure()) return next(result.error)

        return res.status(HTTP_STATUS.OK).json(result.value)
    }
}