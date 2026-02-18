import { prisma } from "../../../infra/prisma.js";
import { IFoodInMealRepository } from "../interfaces/food-in-meal.interfaces.js";
import { FoodInMealDTO, UpdateFoodInMealDTO } from "../interfaces/food-in-meal.schema.js";
import { FoodInMealExtensionModel } from "../interfaces/food-in-meal.interfaces.js";
import { FoodInMeal } from "@prisma/client";

export class FoodInMealRepository implements IFoodInMealRepository {
    async create(foodInMeal: FoodInMealDTO): Promise<FoodInMeal> {
        return await prisma.foodInMeal.create({
            data: foodInMeal,
        });
    }

    async findById(id: string): Promise<FoodInMealExtensionModel | null> {
        return await prisma.foodInMeal.findUnique({
            where: { id },
            include: {
                food: true
            }
        });
    }

    async findByMealId(mealId: string): Promise<FoodInMealExtensionModel[]> {
        return await prisma.foodInMeal.findMany({
            where: { mealId },
            include: {
                food: true
            }
        });
    }

    async findAll(): Promise<FoodInMealExtensionModel[]> {
        return await prisma.foodInMeal.findMany({
            include: {
                food: true
            }
        });
    }

    async findSpecificFoodInMeal(mealId: string, foodId: string): Promise<FoodInMealExtensionModel | null> {
        return await prisma.foodInMeal.findFirst({
            where: { mealId, foodId },
            include: {
                food: true
            }
        });
    }

    async update(id: string, foodInMeal: UpdateFoodInMealDTO): Promise<FoodInMeal> {
        return await prisma.foodInMeal.update({
            where: { id },
            data: foodInMeal
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.foodInMeal.delete({
            where: { id }
        });
    }
}