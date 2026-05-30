import { prisma } from '@ate-a-falha/database'

export const setupTestNutritionContext = async (userId: string) => {
	const food = await prisma.food.create({
		data: {
			name: 'Test Chicken Breast',
			calories: 165,
			carbohydrate: 0,
			protein: 31,
			lipids: 3.6,
			fiber: 0,
			userId: userId,
		},
	})

	const today = new Date()
	today.setUTCHours(0, 0, 0, 0)

	const dietLog = await prisma.dietLog.create({
		data: {
			userId: userId,
			date: today,
		},
	})

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

export const cleanupTestNutritionContext = async (dietLogId: string, foodId: string) => {
	await prisma.dietLog
		.delete({
			where: { id: dietLogId },
		})
		.catch(() => {})

	await prisma.food
		.delete({
			where: { id: foodId },
		})
		.catch(() => {})
}

export const setupTestStandardContext = async (userId: string) => {
	const food = await prisma.food.create({
		data: {
			name: 'Test Chicken Breast',
			calories: 165,
			carbohydrate: 0,
			protein: 31,
			lipids: 3.6,
			fiber: 0,
			userId: userId,
		},
	})

	const diet = await prisma.diet.create({
		data: {
			userId: userId,
			name: 'Cutting Plan',
			dailyKcalGoal: 2000,
			dailyProteinGoal: 150,
			dailyCarbGoal: 200,
			dailyFatGoal: 60,
			dailyWaterGoal: 3000,
			dailyWater: 0,
		},
	})

	const meal = await prisma.meal.create({
		data: {
			dietId: diet.id,
			name: 'Breakfast',
			time: '08:00',
			orderIndex: 0,
		},
	})

	return {
		food,
		diet,
		meal,
	}
}

export const cleanupTestStandardContext = async (dietId: string, foodId: string) => {
	await prisma.diet
		.delete({
			where: { id: dietId },
		})
		.catch(() => {})

	await prisma.food
		.delete({
			where: { id: foodId },
		})
		.catch(() => {})
}
