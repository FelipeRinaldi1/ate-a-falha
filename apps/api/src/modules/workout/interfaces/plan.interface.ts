import { type CreatePlanDTO, type UpdatePlanDTO, type Result } from '@ate-a-falha/shared'
import { type PlanFull } from '@ate-a-falha/database'

export interface IPlanRepository {
	create(data: CreatePlanDTO, userId: string): Promise<Result<PlanFull>>
	update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(userId: string): Promise<Result<PlanFull[]>>
	findById(id: string, userId: string): Promise<Result<PlanFull>>
	findPublicById(id: string): Promise<Result<PlanFull>>
	importPlan(targetPlanId: string, userId: string): Promise<Result<PlanFull>>
}
