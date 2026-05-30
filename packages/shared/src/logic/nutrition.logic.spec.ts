import { describe, test, expect } from 'vitest'
import { NutritionLogic } from './nutrition.logic.js'
import { FoodInMealDTO } from '../schemas/nutrition/foodInMeal.schema.js'
import { MealDTO } from '../schemas/nutrition/meal.schema.js'

describe('Nutrition Logic tests', () => {
	// Reusable Mock Food
	const mockFood1 = {
		id: 'food-1-uuid',
		userId: null,
		name: 'Chicken Breast',
		calories: 165,
		carbohydrate: 0,
		protein: 31,
		lipids: 3.6,
		fiber: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	const mockFood2 = {
		id: 'food-2-uuid',
		userId: 'user-1',
		name: 'Sweet Potato',
		calories: 86,
		carbohydrate: 20.1,
		protein: 1.6,
		lipids: 0.1,
		fiber: 3.0,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	describe('calculateFoodMacros', () => {
		test('Should calculate macros correctly for 100g (factor 1)', () => {
			const foodInMeal: FoodInMealDTO = {
				id: 'fim-1',
				foodId: mockFood1.id,
				food: mockFood1,
				quantity: 100,
				mealId: 'meal-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const result = NutritionLogic.calculateMacros(foodInMeal)
			expect(result).toEqual({
				calories: 165,
				carbohydrates: 0,
				proteins: 31,
				fats: 3.6,
				fiber: 0,
			})
		})

		test('Should calculate macros correctly for 150g (factor 1.5)', () => {
			const foodInMeal: FoodInMealDTO = {
				id: 'fim-2',
				foodId: mockFood2.id,
				food: mockFood2,
				quantity: 150,
				mealId: 'meal-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const result = NutritionLogic.calculateMacros(foodInMeal)
			// Expected for Sweet Potato (150g):
			// calories: 86 * 1.5 = 129
			// carbohydrate: 20.1 * 1.5 = 30.15
			// protein: 1.6 * 1.5 = 2.4
			// lipids: 0.1 * 1.5 = 0.15
			// fiber: 3.0 * 1.5 = 4.5
			expect(result).toEqual({
				calories: 129,
				carbohydrates: 30.15,
				proteins: 2.4,
				fats: 0.15,
				fiber: 4.5,
			})
		})

		test('Should handle rounding to 2 decimal places correctly', () => {
			// Food with values that cause recurring decimals
			const recurringFood = {
				...mockFood1,
				calories: 100,
				carbohydrate: 10.333,
				protein: 15.666,
				lipids: 1.111,
				fiber: 0.555,
			}
			const foodInMeal: FoodInMealDTO = {
				id: 'fim-3',
				foodId: recurringFood.id,
				food: recurringFood,
				quantity: 33, // factor 0.33
				mealId: 'meal-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const result = NutritionLogic.calculateMacros(foodInMeal)
			// Factor: 0.33
			// calories: 100 * 0.33 = 33 -> 33
			// carbohydrate: 10.333 * 0.33 = 3.40989 -> 3.41
			// protein: 15.666 * 0.33 = 5.16978 -> 5.17
			// lipids: 1.111 * 0.33 = 0.36663 -> 0.37
			// fiber: 0.555 * 0.33 = 0.18315 -> 0.18
			expect(result).toEqual({
				calories: 33,
				carbohydrates: 3.41,
				proteins: 5.17,
				fats: 0.37,
				fiber: 0.18,
			})
		})

		test('Should return zeros when quantity is 0', () => {
			const foodInMeal: FoodInMealDTO = {
				id: 'fim-4',
				foodId: mockFood1.id,
				food: mockFood1,
				quantity: 0,
				mealId: 'meal-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const result = NutritionLogic.calculateMacros(foodInMeal)
			expect(result).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})

		test('Should return zeros when quantity is negative', () => {
			const foodInMeal: FoodInMealDTO = {
				id: 'fim-5',
				foodId: mockFood1.id,
				food: mockFood1,
				quantity: -50,
				mealId: 'meal-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			const result = NutritionLogic.calculateMacros(foodInMeal)
			expect(result).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})

		test('Should return zeros when quantity is missing/undefined', () => {
			const foodInMeal = {
				id: 'fim-6',
				foodId: mockFood1.id,
				food: mockFood1,
				mealId: 'meal-1',
				createdAt: new Date(),
				updatedAt: new Date(),
			} as unknown as FoodInMealDTO

			const result = NutritionLogic.calculateMacros(foodInMeal)
			expect(result).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})
	})

	describe('calculateMealMacros', () => {
		test('Should calculate total macros correctly for multiple foods', () => {
			const foodsInMeal: FoodInMealDTO[] = [
				{
					id: 'fim-1',
					foodId: mockFood1.id,
					food: mockFood1,
					quantity: 150, // chicken breast: cal 247.5, carb 0, prot 46.5, fat 5.4, fib 0
					mealId: 'meal-1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 'fim-2',
					foodId: mockFood2.id,
					food: mockFood2,
					quantity: 200, // sweet potato: cal 172, carb 40.2, prot 3.2, fat 0.2, fib 6
					mealId: 'meal-1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]

			const result = NutritionLogic.calculateMealMacros(foodsInMeal)
			// Totals:
			// calories: 247.5 + 172 = 419.5
			// carbohydrates: 0 + 40.2 = 40.2
			// proteins: 46.5 + 3.2 = 49.7
			// fats: 5.4 + 0.2 = 5.6
			// fiber: 0 + 6 = 6
			expect(result).toEqual({
				calories: 419.5,
				carbohydrates: 40.2,
				proteins: 49.7,
				fats: 5.6,
				fiber: 6,
			})
		})

		test('Should return zeros when foodsInMeal is an empty array', () => {
			const result = NutritionLogic.calculateMealMacros([])
			expect(result).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})

		test('Should return zeros when foodsInMeal is null or undefined', () => {
			const resultNull = NutritionLogic.calculateMealMacros(null as unknown as FoodInMealDTO[])
			const resultUndefined = NutritionLogic.calculateMealMacros(undefined as unknown as FoodInMealDTO[])

			expect(resultNull).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
			expect(resultUndefined).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})

		test('Should handle IEEE 754 precision issues and round correctly', () => {
			// Float addition precision issues, e.g. 0.1 + 0.2
			const precisionFood = {
				...mockFood1,
				calories: 0.1,
				carbohydrate: 0.1,
				protein: 0.1,
				lipids: 0.1,
				fiber: 0.1,
			}
			const foodsInMeal: FoodInMealDTO[] = [
				{
					id: 'fim-1',
					foodId: precisionFood.id,
					food: precisionFood,
					quantity: 100, // 0.1
					mealId: 'meal-1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 'fim-2',
					foodId: precisionFood.id,
					food: precisionFood,
					quantity: 200, // 0.2
					mealId: 'meal-1',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]

			const result = NutritionLogic.calculateMealMacros(foodsInMeal)
			expect(result).toEqual({
				calories: 0.3,
				carbohydrates: 0.3,
				proteins: 0.3,
				fats: 0.3,
				fiber: 0.3,
			})
		})
	})

	describe('calculateDietMacros', () => {
		test('Should calculate total macros correctly for multiple meals', () => {
			const meals: MealDTO[] = [
				{
					id: 'meal-1',
					dietId: 'diet-1',
					name: 'Breakfast',
					time: '08:00',
					orderIndex: 0,
					foodsInMeal: [
						{
							id: 'fim-1',
							foodId: mockFood2.id,
							food: mockFood2,
							quantity: 100, // cal 86, carb 20.1, prot 1.6, fat 0.1, fib 3
							mealId: 'meal-1',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				{
					id: 'meal-2',
					dietId: 'diet-1',
					name: 'Lunch',
					time: '12:00',
					orderIndex: 1,
					foodsInMeal: [
						{
							id: 'fim-2',
							foodId: mockFood1.id,
							food: mockFood1,
							quantity: 200, // cal 330, carb 0, prot 62, fat 7.2, fib 0
							mealId: 'meal-2',
							createdAt: new Date(),
							updatedAt: new Date(),
						},
					],
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]

			const result = NutritionLogic.calculateDietMacros(meals)
			// Totals:
			// calories: 86 + 330 = 416
			// carbohydrates: 20.1 + 0 = 20.1
			// proteins: 1.6 + 62 = 63.6
			// fats: 0.1 + 7.2 = 7.3
			// fiber: 3 + 0 = 3
			expect(result).toEqual({
				calories: 416,
				carbohydrates: 20.1,
				proteins: 63.6,
				fats: 7.3,
				fiber: 3,
			})
		})

		test('Should return zeros when meals is an empty array', () => {
			const result = NutritionLogic.calculateDietMacros([])
			expect(result).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})

		test('Should return zeros when meals is null or undefined', () => {
			const resultNull = NutritionLogic.calculateDietMacros(null as unknown as MealDTO[])
			const resultUndefined = NutritionLogic.calculateDietMacros(undefined as unknown as MealDTO[])

			expect(resultNull).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
			expect(resultUndefined).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})

		test('Should handle a meal with null/undefined foodsInMeal list', () => {
			const meals: MealDTO[] = [
				{
					id: 'meal-1',
					dietId: 'diet-1',
					name: 'Empty Meal',
					time: '15:00',
					orderIndex: 2,
					foodsInMeal: null as unknown as FoodInMealDTO[],
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			]

			const result = NutritionLogic.calculateDietMacros(meals)
			expect(result).toEqual({
				calories: 0,
				carbohydrates: 0,
				proteins: 0,
				fats: 0,
				fiber: 0,
			})
		})
	})
})
