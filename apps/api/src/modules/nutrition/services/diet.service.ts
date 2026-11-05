import { type IDietRepository, type IDietLogRepository } from '../interfaces/diet.interface.js'
import {
	type Result,
	failure,
	type authenticatedUser,
	type CreateDietDTO,
	type UpdateDietDTO,
	type CreateDietLogDTO,
	type UpdateDietLogDTO,
} from '@ate-a-falha/shared'
import { type DietFull, type DietLogFull } from '@ate-a-falha/database'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'
import type { INotificationRepository } from '../../notification/interfaces/notification.interface.js'
import { NotificationRepository } from '../../notification/repositories/notification.repository.js'

export class DietService {
	constructor(
		private readonly dietRepo: IDietRepository & IDietLogRepository,
		private readonly accessControl: NutritionAccessControlService,
		private readonly notificationRepo: INotificationRepository = new NotificationRepository()
	) {}

	// Diet Plan CRUD
	async create(data: CreateDietDTO, authUser: authenticatedUser): Promise<Result<DietFull>> {
		return await this.dietRepo.create(data, authUser.id)
	}

	async update(id: string, data: UpdateDietDTO, authUser: authenticatedUser): Promise<Result<DietFull>> {
		const access = await this.accessControl.canAccessDiet(id, authUser)

		if (access.isFailure()) return failure(access.error)

		return await this.dietRepo.update(id, data, authUser.id)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessDiet(id, authUser)

		if (access.isFailure()) return failure(access.error)

		return await this.dietRepo.delete(id, authUser.id)
	}

	async findAll(authUser: authenticatedUser): Promise<Result<DietFull[]>> {
		return await this.dietRepo.findAll(authUser.id)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<DietFull>> {
		const access = await this.accessControl.canAccessDiet(id, authUser)

		if (access.isFailure()) return failure(access.error)

		return await this.dietRepo.findById(id, authUser.id)
	}

	// DietLog Real Consumption CRUD
	async createLog(data: CreateDietLogDTO, authUser: authenticatedUser): Promise<Result<DietLogFull>> {
		return await this.dietRepo.createLog(data, authUser.id)
	}

	async updateLog(id: string, data: UpdateDietLogDTO, authUser: authenticatedUser): Promise<Result<DietLogFull>> {
		const access = await this.accessControl.canAccessDietLog(id, authUser)

		if (access.isFailure()) return failure(access.error)

		const previousLog =
			data.waterIntake !== undefined ? await this.dietRepo.findLogById(id, authUser.id) : null

		const result = await this.dietRepo.updateLog(id, data, authUser.id)

		if (result.isSuccess() && data.waterIntake !== undefined && previousLog?.isSuccess()) {
			const dietsResult = await this.dietRepo.findAll(authUser.id)
			const waterGoal =
				dietsResult.isSuccess() && dietsResult.value[0]?.dailyWaterGoal
					? dietsResult.value[0].dailyWaterGoal
					: 4000

			if (previousLog.value.waterIntake < waterGoal && data.waterIntake >= waterGoal) {
				await this.notificationRepo.create(
					{
						title: 'Meta de Hidratação Atingida',
						message: `Parabéns! Você alcançou sua meta diária de ${waterGoal}ml de água hoje.`,
						type: 'DIET',
						link: '/nutrition',
					},
					authUser.id
				)
			}
		}

		return result
	}

	async deleteLog(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessControl.canAccessDietLog(id, authUser)

		if (access.isFailure()) return failure(access.error)

		return await this.dietRepo.deleteLog(id, authUser.id)
	}

	async findAllLogs(authUser: authenticatedUser): Promise<Result<DietLogFull[]>> {
		return await this.dietRepo.findAllLogs(authUser.id)
	}

	async findLogById(id: string, authUser: authenticatedUser): Promise<Result<DietLogFull>> {
		const access = await this.accessControl.canAccessDietLog(id, authUser)

		if (access.isFailure()) return failure(access.error)

		return await this.dietRepo.findLogById(id, authUser.id)
	}

	async export(id: string): Promise<Result<DietFull>> {
		return await this.dietRepo.findPublicById(id)
	}

	async import(id: string, authUser: authenticatedUser): Promise<Result<DietFull>> {
		const result = await this.dietRepo.importDiet(id, authUser.id)
		if (result.isSuccess()) {
			await this.notificationRepo.create(
				{
					title: 'Dieta Importada com Sucesso',
					message: `A dieta "${result.value.name}" foi adicionada ao seu planejamento.`,
					type: 'SYSTEM',
					link: '/nutrition',
				},
				authUser.id
			)
		}
		return result
	}
}
