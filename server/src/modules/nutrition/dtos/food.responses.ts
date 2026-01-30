import { Food } from "@prisma/client";
import { FoodModel } from "../model/food.model.js";

export interface FoodSearchResult{
    items:FoodModel[] | Food;
    total:Number;
    currentPage:number;
    totalPages:number;
}