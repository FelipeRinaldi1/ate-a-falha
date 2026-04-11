import { Request, Response, NextFunction } from 'express'
import { UserService } from '../services/user.service.js'
import { createUserWithAuthSchema, updateUserSchema, loginSchema, changeEmailSchema, changePasswordSchema } from "@ate-a-falha/shared"

import { HTTP_STATUS } from 'apps/api/src/constants/global/httpCodesConstants.js'
import { validateData } from "@ate-a-falha/shared"


export class UserController {
	constructor(private userService: UserService) { }

	// User CRUD  ────────────────────────────────────────────────────────

	getMe = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.userService.getMe(req.user.id)
		if (result.isFailure()) return next(result.error)
		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	updateMe = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(updateUserSchema, req.body, 'Invalid update data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.updateMe(req.user.id, bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	deleteMe = async (req: Request, res: Response, next: NextFunction) => {
		const result = await this.userService.deleteMe(req.user.id)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	// Auth operations  ────────────────────────────────────────────────────────

	login = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(loginSchema, req.body, 'Invalid credentials')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.login(bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
	register = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(createUserWithAuthSchema, req.body, 'Invalid user data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.register(bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	changePassword = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(changePasswordSchema, req.body, 'Invalid password data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.changePassword(req.user.id, bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	changeEmail = async (req: Request, res: Response, next: NextFunction) => {
		const bodyValidation = validateData(changeEmailSchema, req.body, 'Invalid email data')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.userService.changeEmail(req.user.id, bodyValidation.value)
		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

}

