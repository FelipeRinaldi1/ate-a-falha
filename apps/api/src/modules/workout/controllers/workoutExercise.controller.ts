import { Request, Response, NextFunction } from 'express'
import { WorkoutExerciseService } from '../services/workoutExercise.service.js'
import { validateData } from "@ate-a-falha/shared"

import { CreateWorkoutexerciseSchema, UpdateWorkoutexerciseSchema } from "@ate-a-falha/shared"

import { HTTP_STATUS } from 'apps/api/src/constants/global/httpCodesConstants.js'
import { z } from 'zod'

export class WorkoutExerciseController {
	constructor(private workoutExerciseService: WorkoutExerciseService) { }

	create = async (req: Request, res: Response, next: NextFunction) => {
		const workoutIdValid = validateData(z.uuid(), req.params.workoutId, 'Invalid Workout ID')
		if (workoutIdValid.isFailure()) return next(workoutIdValid.error)

		const bodyValidation = validateData(CreateWorkoutexerciseSchema, req.body, 'Invalid Request Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.workoutExerciseService.create(workoutIdValid.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.CREATED).json(result.value)
	}

	update = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid Workout Exercise ID')
		if (idValid.isFailure()) return next(idValid.error)

		const bodyValidation = validateData(UpdateWorkoutexerciseSchema, req.body, 'Invalid update Body')
		if (bodyValidation.isFailure()) return next(bodyValidation.error)

		const result = await this.workoutExerciseService.update(idValid.value, bodyValidation.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	delete = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid Workout Exercise ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.workoutExerciseService.delete(idValid.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).send()
	}

	findAll = async (req: Request, res: Response, next: NextFunction) => {
		const workoutIdValid = validateData(z.uuid(), req.params.workoutId, 'Invalid Workout ID')
		if (workoutIdValid.isFailure()) return next(workoutIdValid.error)

		const result = await this.workoutExerciseService.findAll(workoutIdValid.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}

	findById = async (req: Request, res: Response, next: NextFunction) => {
		const idValid = validateData(z.uuid(), req.params.id, 'Invalid Workout Exercise ID')
		if (idValid.isFailure()) return next(idValid.error)

		const result = await this.workoutExerciseService.findById(idValid.value, req.user)

		if (result.isFailure()) return next(result.error)

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
