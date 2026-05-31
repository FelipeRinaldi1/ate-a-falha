import {
	type CreatePlanDTO,
	type UpdatePlanDTO,
	failure,
	type Result,
	type authenticatedUser,
} from '@ate-a-falha/shared'
import { type PlanFull } from '@ate-a-falha/database'

import type { IPlanRepository } from '../interfaces/plan.interface.js'

import { WorkoutAccessControlService } from './accessControl.service.js'

export class PlanService {
	constructor(
		private readonly planRepo: IPlanRepository,
		private readonly accessServ: WorkoutAccessControlService
	) {}

	async create(data: CreatePlanDTO, authUser: authenticatedUser): Promise<Result<PlanFull>> {
		const result = await this.planRepo.create(data, authUser.id)
		return result
	}
	async update(id: string, data: UpdatePlanDTO, authUser: authenticatedUser): Promise<Result<PlanFull>> {
		const access = await this.accessServ.canAccessPlan(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.planRepo.update(id, data, authUser.id)
		return result
	}
	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const access = await this.accessServ.canAccessPlan(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.planRepo.delete(id, authUser.id)
		return result
	}
	async findAll(authUser: authenticatedUser): Promise<Result<PlanFull[]>> {
		const result = await this.planRepo.findAll(authUser.id)
		return result
	}
	async findById(id: string, authUser: authenticatedUser): Promise<Result<PlanFull>> {
		const access = await this.accessServ.canAccessPlan(id, authUser.id)
		if (access.isFailure()) return failure(access.error)

		const result = await this.planRepo.findById(id, authUser.id)
		return result
	}
}
