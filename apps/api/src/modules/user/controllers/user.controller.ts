import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service.js'
import { createUserWithAuthSchema, updateUserSchema } from "@ate-a-falha/shared"

import { z } from 'zod'
import { HTTP_STATUS } from 'apps/api/src/@constants/global/httpCodesConstants.js'
import { validateData } from "@ate-a-falha/shared"


export class UserController {
	constructor(private userService: UserService) { }

	create = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(createUserWithAuthSchema, req.body, 'Invalid user data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.create(bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	findAll = async (_req: Request, res: Response, next: NextFunction) => {
		const result = await this.userService.findAll()
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.string().uuid(), req.params.id, 'Invalid user ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.userService.findById(idValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.string().uuid(), req.params.id, 'Invalid user ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const bodyValidation = validateData(updateUserSchema, req.body, 'Invalid update data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.update(idValidation.value, bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValidation = validateData(z.string().uuid(), req.params.id, 'Invalid user ID')
		if (idValidation.isFailure()) return next(idValidation.error)

		const result = await this.userService.delete(idValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
