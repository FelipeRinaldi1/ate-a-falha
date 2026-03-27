import { FoodInMealService } from '../services/foodInMeal.service.js'
import { FoodInMealController } from '../controllers/foodInMeal.controller.js'
import { FoodInMealRepository } from '../repositories/foodInMeal.repository.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'

export class FoodInMealFactory {
	static createController(): FoodInMealController {
		const accessRepo = new NutritionAccessControlRepository()
		const accessServ = new NutritionAccessControlService(accessRepo)
		const foodInMealRepo = new FoodInMealRepository()
		const foodInMealServ = new FoodInMealService(foodInMealRepo, accessServ)
		const foodInMealController = new FoodInMealController(foodInMealServ)

		return foodInMealController
	}
}
