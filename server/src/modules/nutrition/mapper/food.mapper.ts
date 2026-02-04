import { FoodSearchResult } from "../dtos/food.interfaces.js";
import { FoodResponse } from "../dtos/food.responses.js";
import { FoodModel } from "../model/food.model.js";

export class FoodMapper{

    static toHttp(foodData: FoodModel):FoodResponse{
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