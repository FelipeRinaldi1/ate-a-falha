import {
	type CreateBodyMetricDTO,
	type BodyMetricSearchDTO,
	type UpdateBodyMetricDTO,
	type Result,
	success,
	failure,
	type authenticatedUser,
	BodyMetricLogic,
} from '@ate-a-falha/shared'
import { type BodyMetricFull } from '@ate-a-falha/database'
import type { IBodyMetricRepository } from '../interfaces/bodyMetric.interface.js'
import type { IUserRepository } from '../interfaces/user.interfaces.js'

export class BodyMetricService {
	constructor(
		private readonly bodyMetricRepository: IBodyMetricRepository,
		private readonly userRepository: IUserRepository
	) {}

	private calculateAge(birthDate: Date): number {
		const today = new Date()
		let age = today.getFullYear() - birthDate.getFullYear()
		const m = today.getMonth() - birthDate.getMonth()
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--
		}
		return age
	}

	async create(data: CreateBodyMetricDTO, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const userResult = await this.userRepository.findById(authUser.id)
		if (userResult.isFailure()) {
			return failure(userResult.error)
		}
		const user = userResult.value

		const age = this.calculateAge(user.birthDate)
		const bmi = BodyMetricLogic.calculateBMI(data.weight, data.height / 100)
		const bmr = BodyMetricLogic.calculateBMR(
			user.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
			data.weight,
			data.height,
			age
		)
		const tdee = BodyMetricLogic.calculateTDEE(bmr, data.activityLevel)

		const result = await this.bodyMetricRepository.create(
			{ ...data, bmi, bmr, tdee },
			authUser.id
		)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const result = await this.bodyMetricRepository.findById(id, authUser.id)

		if (result.isFailure())
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied.',
			})

		return success(result.value)
	}

	async findAll(data: BodyMetricSearchDTO, authUser: authenticatedUser): Promise<Result<BodyMetricFull[]>> {
		const result = await this.bodyMetricRepository.findAll(data, authUser.id)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(id: string, data: UpdateBodyMetricDTO, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const existingResult = await this.bodyMetricRepository.findById(id, authUser.id)
		if (existingResult.isFailure()) {
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied for update.',
			})
		}
		const existing = existingResult.value

		const userResult = await this.userRepository.findById(authUser.id)
		if (userResult.isFailure()) {
			return failure(userResult.error)
		}
		const user = userResult.value

		const weight = data.weight ?? existing.weight
		const height = data.height ?? existing.height
		const activityLevel = data.activityLevel ?? existing.activityLevel

		const age = this.calculateAge(user.birthDate)
		const bmi = BodyMetricLogic.calculateBMI(weight, height / 100)
		const bmr = BodyMetricLogic.calculateBMR(
			user.gender === 'FEMALE' ? 'FEMALE' : 'MALE',
			weight,
			height,
			age
		)
		const tdee = BodyMetricLogic.calculateTDEE(bmr, activityLevel)

		const result = await this.bodyMetricRepository.update(
			id,
			{ ...data, bmi, bmr, tdee },
			authUser.id
		)

		if (result.isFailure())
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied for update.',
			})
		return success(result.value)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const result = await this.bodyMetricRepository.delete(id, authUser.id)

		if (result.isFailure())
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied for deletion.',
			})

		return success(result.value)
	}

	async hasBodyMetrics(userId: string): Promise<boolean> {
		const result = await this.bodyMetricRepository.countBodyMetrics(userId)

		if (result.isFailure()) {
			throw result.error
		}

		return result.value > 0
	}
}
