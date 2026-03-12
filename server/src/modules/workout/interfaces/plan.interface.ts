import { CreatePlanDTO, UpdatePlanDTO } from '../DTOs/plan.schema.js'
import { PlanEntity } from '../entities/workoutPlan.entity.js'
import { Result } from '@/@utils/result.js'

export interface IPlanRepository {
	create(data: CreatePlanDTO, userId: string): Promise<Result<PlanEntity>>
	update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanEntity>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(userId: string): Promise<Result<PlanEntity[]>>
	findById(id: string, userId: string): Promise<Result<PlanEntity>>
}
