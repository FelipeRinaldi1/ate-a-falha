import { FoodController } from "../http/food.controller.js";
import { FoodRepository } from "../repositories/food.repository.js";
import { FoodService } from "../services/food.service.js";


export function foodFactory(){
    const foodRepository = new FoodRepository()
    const foodService = new FoodService(foodRepository)
    const foodController = new FoodController(foodService)

    return foodController
}