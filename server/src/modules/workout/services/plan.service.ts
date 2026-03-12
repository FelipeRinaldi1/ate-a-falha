import { CreatePlanDTO, UpdatePlanDTO } from '../DTOs/plan.schema.js'
import { PlanEntity } from '../entities/workoutPlan.entity.js'
import { IPlanRepository } from '../interfaces/plan.interface.js'
import { Result } from '@/@utils/result.js'

export class PlanService {
	constructor(private planRepo: IPlanRepository) {}

	async create(data: CreatePlanDTO, userId: string): Promise<Result<PlanEntity>> {
		const result = await this.planRepo.create(data, userId)
		return result
	}
	async update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanEntity>> {
		const result = await this.planRepo.update(id, data, userId)
		return result
	}
	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await this.planRepo.delete(id, userId)
		return result
	}
	async findAll(userId: string): Promise<Result<PlanEntity[]>> {
		const result = await this.planRepo.findAll(userId)
		return result
	}
	async findById(id: string, userId: string): Promise<Result<PlanEntity>> {
		const result = await this.planRepo.findById(id, userId)
		return result
	}
}
