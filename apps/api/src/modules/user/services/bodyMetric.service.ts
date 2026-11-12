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
import { UserAccessControlService } from './userAccessControl.service.js'
import type { INotificationService } from '../../notification/interfaces/notification.interface.js'
import { logger } from '../../../config/logger.js'

export class BodyMetricService {
	constructor(
		private readonly bodyMetricRepository: IBodyMetricRepository,
		private readonly userRepository: IUserRepository,
		private readonly accessControl: UserAccessControlService,
		private readonly notificationService: INotificationService
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
		const bmi = BodyMetricLogic.calculateBMI(data.weight, data.height)
		const bmr = BodyMetricLogic.calculateBMR(user.gender, data.weight, data.height, age)
		const tdee = BodyMetricLogic.calculateTDEE(bmr, data.activityLevel)

		const result = await this.bodyMetricRepository.create({ ...data, bmi, bmr, tdee }, authUser.id)

		if (result.isFailure()) {
			return failure(result.error)
		}

		const notifResult = await this.notificationService.create(
			{
				title: 'Evolução Física Atualizada',
				message: `Nova avaliação registrada: ${data.weight}kg (IMC: ${bmi.toFixed(1)}).`,
				type: 'SUCCESS',
				link: '/profile/evolution',
			},
			authUser
		)
		if (notifResult.isFailure()) {
			logger.warn({ err: notifResult.error, userId: authUser.id }, 'Failed to create body metric notification')
		}

		return success(result.value)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const access = await this.accessControl.canAccessBodyMetric(id, authUser)
		if (access.isFailure()) return failure(access.error)

		const ownerScope = authUser.role === 'ADMIN' ? undefined : authUser.id
		const result = await this.bodyMetricRepository.findById(id, ownerScope)
		if (result.isFailure()) return failure(result.error)

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
		const access = await this.accessControl.canAccessBodyMetric(id, authUser)
		if (access.isFailure()) return failure(access.error)

		const ownerScope = authUser.role === 'ADMIN' ? undefined : authUser.id
		const existingResult = await this.bodyMetricRepository.findById(id, ownerScope)
		if (existingResult.isFailure()) {
			return failure(existingResult.error)
		}
		const existing = existingResult.value

		const userResult = await this.userRepository.findById(existing.userId)
		if (userResult.isFailure()) {
			return failure(userResult.error)
		}
		const user = userResult.value

		const weight = data.weight ?? existing.weight
		const height = data.height ?? existing.height
		const activityLevel = data.activityLevel ?? existing.activityLevel

		const age = this.calculateAge(user.birthDate)
		const bmi = BodyMetricLogic.calculateBMI(weight, height)
		const bmr = BodyMetricLogic.calculateBMR(user.gender, weight, height, age)
		const tdee = BodyMetricLogic.calculateTDEE(bmr, activityLevel)

		const result = await this.bodyMetricRepository.update(id, { ...data, bmi, bmr, tdee }, existing.userId)

		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessBodyMetric(id, authUser)
		if (access.isFailure()) return failure(access.error)

		const ownerScope = authUser.role === 'ADMIN' ? undefined : authUser.id
		const existingResult = await this.bodyMetricRepository.findById(id, ownerScope)
		if (existingResult.isFailure()) return failure(existingResult.error)

		const result = await this.bodyMetricRepository.delete(id, existingResult.value.userId)

		if (result.isFailure()) {
			return failure(result.error)
		}

		return success(result.value)
	}

	async recalculateLatestForUser(user: {
		id: string
		birthDate: Date
		gender: 'MALE' | 'FEMALE' | 'OTHER'
	}): Promise<Result<void>> {
		const listResult = await this.bodyMetricRepository.findAll({ take: 1 }, user.id)
		if (listResult.isFailure()) return failure(listResult.error)

		const latest = listResult.value[0]
		if (!latest) return success(undefined)

		const age = this.calculateAge(user.birthDate)
		const bmi = BodyMetricLogic.calculateBMI(latest.weight, latest.height)
		const bmr = BodyMetricLogic.calculateBMR(user.gender, latest.weight, latest.height, age)
		const tdee = BodyMetricLogic.calculateTDEE(bmr, latest.activityLevel)

		const updateResult = await this.bodyMetricRepository.update(latest.id, { bmi, bmr, tdee }, user.id)
		if (updateResult.isFailure()) return failure(updateResult.error)

		return success(undefined)
	}

	async hasBodyMetrics(userId: string): Promise<Result<boolean>> {
		const result = await this.bodyMetricRepository.countBodyMetrics(userId)

		if (result.isFailure()) {
			return failure(result.error)
		}

		return success(result.value > 0)
	}
}
