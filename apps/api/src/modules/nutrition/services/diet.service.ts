import { IDietRepository } from '../interfaces/diet.interface.js'
import { Result, failure } from '@ate-a-falha/shared'

import { CreateDietDTO, UpdateDietDTO } from '@ate-a-falha/shared'
import { DietFull } from '@ate-a-falha/database'

import { NutritionAccessControlService } from './nutritionAccessControl.service.js'
import { authenticatedUser } from '@ate-a-falha/shared'

export class DietService {
	constructor(
		private dietRepo: IDietRepository,
		private accessControl: NutritionAccessControlService
	) {}

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
}
