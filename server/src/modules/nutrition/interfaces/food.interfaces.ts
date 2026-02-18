import { createFoodDTO, foodSearchDTO, updateFoodDTO } from "./food.schema.js";
import { Food } from "@prisma/client";

export interface IFoodRepository{
    create(data:createFoodDTO,userId?:string):Promise <Food>;
    findAll(params:foodSearchDTO,userId:string):Promise<FoodSearchResult>;
    findById(id:string,userId?:string):Promise<Food|null>;
    update(id:string,userId:string, data:updateFoodDTO):Promise<Food>;
    delete(id:string,userId:string):Promise<void>;
}

export type FoodResponse = {
    id: string;
    name: string;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    fiber: number;
    userId :string | null,
    isSystemFood: boolean,
}

export interface FoodSearchResult{
    items:Food[] | Food;
    total:Number;
    currentPage:number;
    totalPages:number;
}
