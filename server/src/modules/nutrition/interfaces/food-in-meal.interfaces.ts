import { FoodInMealDTO,UpdateFoodInMealDTO} from "./food-in-meal.schema.js";
import { FoodInMeal, Prisma } from "@prisma/client";

export interface IFoodInMealRepository {
    create(foodInMeal: FoodInMealDTO,userId:string): Promise<FoodInMeal>
    findById(id: string,userId:string): Promise<FoodInMealExtensionModel | null>
    findByMealId(mealId: string,userId:string): Promise<FoodInMealExtensionModel[]>
    findAll(userId:string): Promise<FoodInMealExtensionModel[]>
    findSpecificFoodInMeal(mealId: string, foodId: string): Promise<FoodInMealExtensionModel | null>
    update(id: string,userId:string, foodInMeal: UpdateFoodInMealDTO): Promise<FoodInMeal | null>
    delete(id: string,userId:string): Promise<void>
}

export type FoodInMealExtensionModel = Prisma.FoodInMealGetPayload<{
  include: { food: true }
}>