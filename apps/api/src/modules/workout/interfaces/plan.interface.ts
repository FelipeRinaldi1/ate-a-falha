import { CreatePlanDTO, UpdatePlanDTO } from "@ate-a-falha/shared"
import { PlanFull } from "@ate-a-falha/database"

import { Result } from "@ate-a-falha/shared"


export interface IPlanRepository {
	create(data: CreatePlanDTO, userId: string): Promise<Result<PlanFull>>
	update(id: string, data: UpdatePlanDTO, userId: string): Promise<Result<PlanFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	findAll(userId: string): Promise<Result<PlanFull[]>>
	findById(id: string, userId: string): Promise<Result<PlanFull>>
}
