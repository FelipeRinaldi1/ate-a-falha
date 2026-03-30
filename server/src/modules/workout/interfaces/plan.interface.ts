import { CreatePlanDTO, UpdatePlanDTO, PlanFull } from '../schema/plan.schema.js'
import { Result } from '@/@utils/result.js'

export interface IPlanRepository {
	create(data: CreatePlanDTO, userId: string): Promise<Result<PlanFull>>
	update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(userId: string): Promise<Result<PlanFull[]>>
	findById(id: string, userId: string): Promise<Result<PlanFull>>
}
