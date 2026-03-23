import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'
import { SetRepository } from '../repositories/set.repository.js'
import { SetService } from '../services/set.service.js'
import { SetController } from '../controllers/set.controller.js'

export class SetFactory {
	static createController() {
		const accessRepo = new WorkoutAccessControlRepository()
		const accessService = new WorkoutAccessControlService(accessRepo)
		const setRepo = new SetRepository()
		const setService = new SetService(setRepo, accessService)
		const setController = new SetController(setService)

		return setController
	}
}
