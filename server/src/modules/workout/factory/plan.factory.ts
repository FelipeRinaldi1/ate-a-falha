import { PlanRepository } from '../repositories/plan.repository.js'
import { PlanService } from '../services/plan.service.js'
import { PlanController } from '../controllers/plan.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'

export class PlanFactory {
	static createController() {
		const accessRepo = new WorkoutAccessControlRepository()
		const accessService = new WorkoutAccessControlService(accessRepo)

		const planRepo = new PlanRepository()

		const planService = new PlanService(planRepo, accessService)

		const planController = new PlanController(planService)

		return planController
	}
}
