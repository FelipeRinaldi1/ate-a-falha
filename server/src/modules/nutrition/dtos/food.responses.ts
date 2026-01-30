import { Food } from "@prisma/client";
import { FoodModel } from "../model/food.model.js";

export type FoodResponse = {
    id: string;
    name: string;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    fiber: number;
}

export interface FoodSearchResult{
    items:FoodModel[] | Food;
    total:Number;
    currentPage:number;
    totalPages:number;
}
