import { Meal, Prisma } from "@prisma/client";
import { MealDTO,UpdateMealDTO } from "./meal.schema.js";
export interface IMealRepository{
    create(meal:MealDTO):Promise<Meal>;
    findById(id:string):Promise<MealExtendedModel | null>;
    findAll():Promise<MealExtendedModel[]>;
    findAllByDietId(dietId:string):Promise<MealExtendedModel[]>;
    update(id:string, meal:UpdateMealDTO):Promise<Meal>;
    delete(id:string):Promise<void>;
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