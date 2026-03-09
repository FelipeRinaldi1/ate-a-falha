import { Food } from '@/generated/prisma/client.js'
import { FoodEntity } from '../entities/food.entity.js'

export class FoodMapper {
	static toEntity(prismaFood: Food): FoodEntity {
		return {
			id: prismaFood.id,
			name: prismaFood.name,
			baseUnit: prismaFood.baseUnit,
			baseAmount: prismaFood.baseAmount,
			calories: prismaFood.calories,
			carbohydrate: prismaFood.carbohydrate,
			protein: prismaFood.protein,
			fat: prismaFood.fat,
			fiber: prismaFood.fiber,
			userId: prismaFood.userId,
			createdAt: prismaFood.createdAt,
			updatedAt: prismaFood.updatedAt,
		}
	}
}
