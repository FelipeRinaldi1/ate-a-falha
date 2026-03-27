import { FoodRepository } from '../repositories/food.repository.js'
import { FoodService } from '../services/food.service.js'
import { FoodController } from '../controllers/food.controller.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'

export class FoodFactory {
	static createController(): FoodController {
		const accessRepo = new NutritionAccessControlRepository()
		const accessControl = new NutritionAccessControlService(accessRepo)
		const foodRepository = new FoodRepository()
		const foodService = new FoodService(foodRepository, accessControl)
		return new FoodController(foodService)
	}
}
