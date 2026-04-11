import { FoodInMealDTO  } from "../schemas/nutrition/foodInMeal.schema.js";
import { MealDTO } from "../schemas/nutrition/meal.schema.js";
export class NutritionLogic {
    static calculateMacros(foodInMeal: FoodInMealDTO) {
        const { food, quantity } = foodInMeal;

        if (!quantity || quantity <= 0) {
            return { calories: 0, carbohydrates: 0, proteins: 0, fats: 0, fiber: 0 };
        }
        
        const factor = quantity / 100;
        
        return {
            calories: Number((food.calories * factor).toFixed(2)),
            carbohydrates: Number((food.carbohydrate * factor).toFixed(2)),
            proteins: Number((food.protein * factor).toFixed(2)),
            fiber: Number((food.fiber * factor).toFixed(2)),
            fats: Number((food.fat * factor).toFixed(2))
        };
    }

    static calculateMealMacros(foodsInMeal: FoodInMealDTO[]) {
        const initialValues = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0, fiber: 0 };
        const totals = (foodsInMeal || []).reduce((accumulator, item) => {
            const foodMacros = this.calculateMacros(item);

            return {
                calories: accumulator.calories + foodMacros.calories,
                carbohydrates: accumulator.carbohydrates + foodMacros.carbohydrates,
                proteins: accumulator.proteins + foodMacros.proteins,
                fats: accumulator.fats + foodMacros.fats,
                fiber: accumulator.fiber + foodMacros.fiber
            };
        }, initialValues);

        return {
            calories: Number(totals.calories.toFixed(2)),
            carbohydrates: Number(totals.carbohydrates.toFixed(2)),
            proteins: Number(totals.proteins.toFixed(2)),
            fats: Number(totals.fats.toFixed(2)),
            fiber: Number(totals.fiber.toFixed(2))
        };
    }

    static calculateDietMacros(meals: MealDTO[]) {
        const initialValues = { calories: 0, carbohydrates: 0, proteins: 0, fats: 0, fiber: 0 };

        const totals = (meals || []).reduce((accumulator, meal) => {
            const mealMacros = this.calculateMealMacros(meal.foodsInMeal);
            return {
                calories: accumulator.calories + mealMacros.calories,
                carbohydrates: accumulator.carbohydrates + mealMacros.carbohydrates,
                proteins: accumulator.proteins + mealMacros.proteins,
                fats: accumulator.fats + mealMacros.fats,
                fiber: accumulator.fiber + mealMacros.fiber
            };
        }, initialValues);

        return {
            calories: Number(totals.calories.toFixed(2)),
            carbohydrates: Number(totals.carbohydrates.toFixed(2)),
            proteins: Number(totals.proteins.toFixed(2)),
            fats: Number(totals.fats.toFixed(2)),
            fiber: Number(totals.fiber.toFixed(2))
        };
    }
}