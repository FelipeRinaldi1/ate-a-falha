import { MealEntity } from '../entities/meal.enitity.js'
import { Meal } from '@/generated/prisma/client.js'

export class MealMapper {
	static toEntity(meal: Meal): MealEntity {
		return {
			id: meal.id,
			name: meal.name,
			time: meal.time,
			orderIndex: meal.orderIndex,
			dietId: meal.dietId,
			createdAt: meal.createdAt,
			updatedAt: meal.updatedAt,
		}
	}
}
