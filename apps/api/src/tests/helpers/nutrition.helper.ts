import { prisma } from '@ate-a-falha/database'

export const setupTestNutritionContext = async (userId: string) => {
	// 1. Create a dummy food in the database
	const food = await prisma.food.create({
		data: {
			name: 'Test Chicken Breast',
			calories: 165,
			carbohydrate: 0,
			protein: 31,
			lipids: 3.6,
			fiber: 0,
			userId: userId, // Optional, can be associated with user
		},
	})

	// 2. Create a DietLog for today
	const today = new Date()
	today.setUTCHours(0, 0, 0, 0)

	const dietLog = await prisma.dietLog.create({
		data: {
			userId: userId,
			date: today,
		},
	})

	// 3. Create a MealLog under that DietLog
	const mealLog = await prisma.mealLog.create({
		data: {
			dietLogId: dietLog.id,
			name: 'Almoço',
			time: '12:00',
			orderIndex: 0,
		},
	})

	return {
		food,
		dietLog,
		mealLog,
	}
}

export const cleanupTestNutritionContext = async (
	dietLogId: string,
	foodId: string
) => {
	// Cascading deletes on DietLog will delete MealLog and FoodLogs automatically
	await prisma.dietLog.delete({
		where: { id: dietLogId },
	}).catch(() => {})

	await prisma.food.delete({
		where: { id: foodId },
	}).catch(() => {})
}
