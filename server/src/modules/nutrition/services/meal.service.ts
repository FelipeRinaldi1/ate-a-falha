import { IFoodInMealRepository } from "../interfaces/food-in-meal.interfaces.js";
import { IMealRepository, MealExtendedModel } from "../interfaces/meal.interfaces.js";
import { FoodInMealDTO, UpdateFoodInMealDTO } from "../interfaces/food-in-meal.schema.js";
import { MealDTO, UpdateMealDTO } from "../interfaces/meal.schema.js";
import { AppError } from "../../../@utils/appError.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { IDietRepository } from "../interfaces/diet.interfaces.js";
import { SecurityUtils } from "../../../@utils/accessControl.js";

export class MealService {
    constructor(
        private mealRepository: IMealRepository, 
        private foodInMealRepository: IFoodInMealRepository,
        private dietRepository: IDietRepository
    ) {}

    private async getMealAndValidate(mealId:string, userId: string):Promise <MealExtendedModel>{
        const meal = await this.mealRepository.findById(mealId) as MealExtendedModel
        SecurityUtils.ensureOwnership(meal?.diet,userId)
        return meal;
    }

    async getMealSummary(mealId: string, userId: string) {
        const meal = await this.getMealAndValidate(mealId,userId)

        const totals = meal.foods.reduce((acc, item) => {
            acc.calories += item.quantity * item.food.calories;
            acc.protein += item.quantity * item.food.protein;
            acc.carbs += item.quantity * item.food.carbohydrate;
            acc.fat += item.quantity * item.food.fat;
            acc.fiber += item.quantity * (item.food.fiber ?? 0);
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

        return {
            id: meal.id,
            name: meal.name,
            dietId: meal.dietId,
            foods: meal.foods, 
            calories: Number(totals.calories.toFixed(1)),
            protein: Number(totals.protein.toFixed(1)),
            carbs: Number(totals.carbs.toFixed(1)),
            fat: Number(totals.fat.toFixed(1)),
            fiber: Number(totals.fiber.toFixed(1))
        };
    }

    async createMeal(meal: MealDTO) {
        return await this.mealRepository.create(meal);
    }

    async findAllMeals() {
        return await this.mealRepository.findAll();
    }

    async findMealById(id: string) {
        const meal = await this.mealRepository.findById(id);
        if (!meal) throw new AppError("Meal not found", HTTP_STATUS.NOT_FOUND);
        return meal;
    }

    async findMealsByDietId(dietId: string) {
        return await this.mealRepository.findAllByDietId(dietId);
    }

    async updateMeal(id: string, meal: UpdateMealDTO) {
        return await this.mealRepository.update(id, meal);
    }

    async deleteMeal(id: string) {
        await this.mealRepository.delete(id);
    }

    // CRUD de Food in Meal
    async addFoodToMeal(foodInMeal: FoodInMealDTO) {
        const meal = await this.mealRepository.findById(foodInMeal.mealId);
        if (!meal) throw new AppError("Meal not Found", HTTP_STATUS.NOT_FOUND);

        const existingFood = await this.foodInMealRepository.findSpecificFoodInMeal(
            foodInMeal.mealId, 
            foodInMeal.foodId
        );

        if (existingFood) {
            const newQuantity = existingFood.quantity + foodInMeal.quantity;
            return await this.foodInMealRepository.update(existingFood.id, { quantity: newQuantity });
        }
        return await this.foodInMealRepository.create(foodInMeal);
    }
    async findFoodInMealById(id: string) {
        return await this.foodInMealRepository.findById(id);
    }

    async findAllFoodInMealByMealId(mealId: string) {
        return await this.foodInMealRepository.findByMealId(mealId);
    }

    async updateFoodInMeal(id: string, foodInMeal: UpdateFoodInMealDTO) {
        return await this.foodInMealRepository.update(id, foodInMeal);
    }

    async deleteFoodInMeal(id: string) {
        await this.foodInMealRepository.delete(id);
    }
}