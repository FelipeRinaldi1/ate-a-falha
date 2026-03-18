import { IDietRepository } from '../interfaces/diet.interface.js'
import { Result, failure } from '@/@utils/result.js'
import { DietEntity } from '../entities/diet.entity.js'
import { NutritionAccessControlService } from './nutritionAccessControl.service.js'
import { CreateDietDTO, UpdateDietDTO } from '../DTOs/diet.schema.js'
import { authenticatedUser } from '@/@shared/authenticatedUser.js'

export class DietService {
	constructor(
		private dietRepo: IDietRepository,
		private accessControl: NutritionAccessControlService
	) {}

	async create(data: CreateDietDTO, authUser: authenticatedUser): Promise<Result<DietEntity>> {
		const result = await this.dietRepo.create(data, authUser.id)

		return result
	}

	async update(id: string, data: UpdateDietDTO, userId: string): Promise<Result<DietEntity>> {
		const access = await this.accessControl.canAccessDiet(id, userId)

		if (access.isFailure()) return failure(access.error)

		const result = await this.dietRepo.update(id, data, userId)

		return result
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const access = await this.accessControl.canAccessDiet(id, userId)

		if (access.isFailure()) return failure(access.error)

		const result = await this.dietRepo.delete(id, userId)

		return result
	}

	async findAll(userId: string): Promise<Result<DietEntity[]>> {
		const result = await this.dietRepo.findAll(userId)

		return result
	}

	async findById(id: string, userId: string): Promise<Result<DietEntity>> {
		const access = await this.accessControl.canAccessDiet(id, userId)

		if (access.isFailure()) return failure(access.error)

		const result = await this.dietRepo.findById(id, userId)

		return result
	}
}
