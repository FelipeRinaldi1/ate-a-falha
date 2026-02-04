import { FoodModel } from "../model/food.model.js";
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from "./food.schema.js";
import { Food } from "@prisma/client";

export interface IFoodRepository{
    create(data:createFoodDTO):Promise < FoodModel>;
    findAll(params:foodSearchDTO,userId:string):Promise<FoodSearchResult>;
    findById(id:string):Promise<FoodModel|null>;
    findByName(name:string):Promise<FoodModel|null>;
    update(id:string, data:updateFoodDTO):Promise<FoodModel>;
    delete(id:string):Promise<void>;
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
    items:FoodModel[] | Food;
    total:Number;
    currentPage:number;
    totalPages:number;
}
