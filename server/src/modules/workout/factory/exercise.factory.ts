import { ExerciseRepository } from '../repositories/exercise.repository.js'
import { ExerciseService } from '../services/exercise.service.js'
import { ExerciseController } from '../controllers/exercise.controller.js'
import { AccessControlService } from '../services/accessControl.service.js'
import { AccessControlRepository } from '../repositories/accessControl.repository.js'

export class ExerciseFactory {
	static createController(): ExerciseController {
		const exerciseRepo = new ExerciseRepository()
		const accessControlRepo = new AccessControlRepository()
		const accessControl = new AccessControlService(accessControlRepo)
		const exerciseService = new ExerciseService(exerciseRepo, accessControl)
		const exerciseController = new ExerciseController(exerciseService)

		return exerciseController
	}
}
