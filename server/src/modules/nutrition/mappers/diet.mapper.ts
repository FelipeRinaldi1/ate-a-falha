import { DietEntity } from '../entities/diet.entity.js'
import { Diet } from '@/generated/prisma/client.js'

export class DietMapper {
	static toEntity(diet: Diet): DietEntity {
		return {
			id: diet.id,
			name: diet.name,
			dailyKcalGoal: diet.dailyKcalGoal,
			dailyProteinGoal: diet.dailyProteinGoal,
			dailyCarbGoal: diet.dailyCarbGoal,
			dailyFatGoal: diet.dailyFatGoal,
			dailyWaterGoal: diet.dailyWaterGoal,
			dailyWater: diet.dailyWater,
			userId: diet.userId,
			createdAt: diet.createdAt,
			updatedAt: diet.updatedAt,
		}
	}
}
