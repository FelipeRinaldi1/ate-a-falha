import { CreateFoodDTO } from '../schemas/nutrition/food.schema.js'
import { FoodInMealDTO } from '../schemas/nutrition/foodInMeal.schema.js'
import { MealDTO } from '../schemas/nutrition/meal.schema.js'

export class NutritionLogic {
	static calculateCalories(protein: number, carbohydrate: number, lipids: number, _fiber?: number): number {
		return Number((protein * 4 + carbohydrate * 4 + lipids * 9).toFixed(2))
	}

	static calculateMacros(carbohydrates: number, proteins: number, lipds: number) {
		return {
			calories: this.calculateCalories(proteins, carbohydrates, lipds),
		}
	}

	static normalizeMacrosTo100g(food: CreateFoodDTO, weight: number) {
		const factor = 100 / weight

		return {
			name: food.name,
			protein: Number((food.protein * factor).toFixed(2)),
			carbohydrate: Number((food.carbohydrate * factor).toFixed(2)),
			lipids: Number((food.lipids * factor).toFixed(2)),
			fiber: Number((food.fiber * factor).toFixed(2)),
		}
	}

	static normalizeMacros(
		name: string,
		quantity: number,
		protein: number,
		carbohydrate: number,
		lipids: number,
		fiber: number
	) {
		const normalized = this.normalizeMacrosTo100g({ name, protein, carbohydrate, lipids, fiber }, quantity)
		return {
			...normalized,
			calories: this.calculateCalories(normalized.protein, normalized.carbohydrate, normalized.lipids),
		}
	}

	static calculateFoodInMealMacros(foodInMeal: FoodInMealDTO) {
		const { food, quantity } = foodInMeal

		if (!quantity || quantity <= 0) {
			return { calories: 0, carbohydrates: 0, proteins: 0, fats: 0, fiber: 0 }
		}

		const factor = quantity / 100

		return {
			calories: Number((food.calories * factor).toFixed(2)),
			carbohydrates: Number((food.carbohydrate * factor).toFixed(2)),
			proteins: Number((food.protein * factor).toFixed(2)),
			fiber: Number((food.fiber * factor).toFixed(2)),
			fats: Number((food.lipids * factor).toFixed(2)),
		}
	}

	static calculateMealMacros(foodsInMeal: FoodInMealDTO[]) {
		const initialValues = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0, fiber: 0 }
		const totals = (foodsInMeal || []).reduce((accumulator, item) => {
			const foodMacros = this.calculateFoodInMealMacros(item)

			return {
				calories: accumulator.calories + foodMacros.calories,
				carbohydrates: accumulator.carbohydrates + foodMacros.carbohydrates,
				proteins: accumulator.proteins + foodMacros.proteins,
				fats: accumulator.fats + foodMacros.fats,
				fiber: accumulator.fiber + foodMacros.fiber,
			}
		}, initialValues)

		return {
			calories: Number(totals.calories.toFixed(2)),
			carbohydrates: Number(totals.carbohydrates.toFixed(2)),
			proteins: Number(totals.proteins.toFixed(2)),
			fats: Number(totals.fats.toFixed(2)),
			fiber: Number(totals.fiber.toFixed(2)),
		}
	}

	static calculateDietMacros(meals: MealDTO[]) {
		const initialValues = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0, fiber: 0 }

		const totals = (meals || []).reduce((accumulator, meal) => {
			const mealMacros = this.calculateMealMacros(meal.foodsInMeal)
			return {
				calories: accumulator.calories + mealMacros.calories,
				carbohydrates: accumulator.carbohydrates + mealMacros.carbohydrates,
				proteins: accumulator.proteins + mealMacros.proteins,
				fats: accumulator.fats + mealMacros.fats,
				fiber: accumulator.fiber + mealMacros.fiber,
			}
		}, initialValues)

		return {
			calories: Number(totals.calories.toFixed(2)),
			carbohydrates: Number(totals.carbohydrates.toFixed(2)),
			proteins: Number(totals.proteins.toFixed(2)),
			fats: Number(totals.fats.toFixed(2)),
			fiber: Number(totals.fiber.toFixed(2)),
		}
	}
}
