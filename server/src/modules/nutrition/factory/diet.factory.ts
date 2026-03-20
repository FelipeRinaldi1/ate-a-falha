import { DietService } from '../services/diet.service.js'
import { DietController } from '../controllers/diet.controller.js'
import { DietRepository } from '../repositories/diet.repository.js'
import { NutritionAccessControlService } from '../services/nutritionAccessControl.service.js'
import { NutritionAccessControlRepository } from '../repositories/accessControl.repository.js'

export class DietFactory {
	static createController() {
		const accessRepo = new NutritionAccessControlRepository()
		const accessServ = new NutritionAccessControlService(accessRepo)
		const dietRepo = new DietRepository()
		const dietService = new DietService(dietRepo, accessServ)
		const dietController = new DietController(dietService)

		return dietController
	}
}
