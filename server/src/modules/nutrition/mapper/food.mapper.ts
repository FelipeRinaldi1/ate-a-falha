import { FoodResponse } from "../interfaces/food.interfaces.js";
import { Food } from "@prisma/client";

export class FoodMapper{

    static toHttp(foodData: Food):FoodResponse{
        return{
            id:foodData.id,
            name: foodData.name,
            calories: foodData.calories,
            carbohydrate:foodData.carbohydrate,
            protein: foodData.protein,
            fat: foodData.fat,
            fiber: foodData.fiber ?? 0,

            userId: foodData.userId ?? null,
            isSystemFood: !foodData.userId
        }
    }
}