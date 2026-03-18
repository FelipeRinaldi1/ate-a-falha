import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '@/@constants/global/httpCodesConstants.js'
import { DietService } from '../services/diet.service.js'
import { validateData } from '@/@utils/validateData.js'
import { createDietSchema, updateDietSchema } from '../DTOs/diet.schema.js'

export class DietControler {
	constructor(private dietService: DietService) {}

	create = async (req: Request, res: Response, next: NextFunction) => {
		const validation = validateData(createDietSchema, req.body, 'Invalid Request Body')
		if (validation.isFailure()) return next(validation.error)

		const result = await this.dietService.create(validation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

    update = async (req:Request,res:Response,next:NextFunction){
        const validation = validateData(updateDietSchema,req.body, 'Invalid Request Body')
    }
}
