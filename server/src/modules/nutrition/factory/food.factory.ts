import { FoodRepository } from '../repositories/food.repository.js'
import { FoodService } from '../services/food.service.js'
import { FoodController } from '../controllers/food.controller.js'

export class FoodFactory {
	static createController() {
		const foodRepository = new FoodRepository()
		const foodService = new FoodService(foodRepository)
		return new FoodController(foodService)
	}
}
