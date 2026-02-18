import { FoodInMealDTO,UpdateFoodInMealDTO} from "./food-in-meal.schema.js";
import { FoodInMeal, Prisma } from "@prisma/client";

export interface IFoodInMealRepository {
    create(foodInMeal: FoodInMealDTO): Promise<FoodInMeal>
    findById(id: string): Promise<FoodInMealExtensionModel | null>
    findByMealId(mealId: string): Promise<FoodInMealExtensionModel[]>
    findAll(): Promise<FoodInMealExtensionModel[]>
    findSpecificFoodInMeal(mealId: string, foodId: string): Promise<FoodInMealExtensionModel | null>
    update(id: string, foodInMeal: UpdateFoodInMealDTO): Promise<FoodInMeal | null>
    delete(id: string): Promise<void>
}

export type FoodInMealExtensionModel = Prisma.FoodInMealGetPayload<{
  include: { food: true }
}>