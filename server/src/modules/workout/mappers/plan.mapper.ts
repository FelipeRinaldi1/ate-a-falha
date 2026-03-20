import { PlanEntity } from '../entities/workoutPlan.entity.js'
import { Plan } from '@/generated/prisma/client.js'

export class PlanMapper {
	static toEntity(plan: Plan): PlanEntity {
		return {
			id: plan.id,
			name: plan.name,
			isActive: plan.isActive,
			userId: plan.userId,
			createdAt: plan.createdAt,
			updatedAt: plan.updatedAt,
		}
	}
}
