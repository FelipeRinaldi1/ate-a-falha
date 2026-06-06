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

export class DietService {
	constructor(
		private readonly dietRepo: IDietRepository & IDietLogRepository,
		private readonly accessControl: NutritionAccessControlService
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

		return await this.dietRepo.updateLog(id, data, authUser.id)
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
		return await this.dietRepo.importDiet(id, authUser.id)
	}
}
