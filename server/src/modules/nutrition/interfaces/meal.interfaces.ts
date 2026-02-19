import { Meal, Prisma } from "@prisma/client";
import { MealDTO,UpdateMealDTO } from "./meal.schema.js";
export interface IMealRepository {

  create(meal: MealDTO, userId: string): Promise<Meal>;
  
  findById(id: string, userId: string): Promise<MealExtendedModel | null>;
  findAll(userId: string): Promise<MealExtendedModel[]>;
  findAllByDietId(dietId: string, userId: string): Promise<MealExtendedModel[]>;
  
  update(id: string, userId: string, meal: UpdateMealDTO): Promise<Meal>;
  delete(id: string, userId: string): Promise<void>;
}

export const mealFullInclude={
    diet:true,
    foods:{
        include:{
            food:true
        }
    }
}

export type MealExtendedModel = Prisma.MealGetPayload<{include:typeof mealFullInclude}>;