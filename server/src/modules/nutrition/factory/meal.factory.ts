import { MealService } from '../services/meal.service.js'
import { MealController } from '../controllers/meal.controller.js'
import { MealRepository } from '../repositories/meal.repository.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'

export class MealFactory {
	static createController() {
		const accessRepo = new NutritionAccessControlRepository()
		const accessServ = new NutritionAccessControlService(accessRepo)
		const mealRepo = new MealRepository()
		const mealService = new MealService(mealRepo, accessServ)
		const mealController = new MealController(mealService)

		return mealController
	}
}
