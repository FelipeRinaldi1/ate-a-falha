import { ExerciseRepository } from '../repositories/exercise.repository.js'
import { ExerciseService } from '../services/exercise.service.js'
import { ExerciseController } from '../controllers/exercise.controller.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'

export class ExerciseFactory {
	static createController(): ExerciseController {
		const exerciseRepo = new ExerciseRepository()
		const accessControlRepo = new WorkoutAccessControlRepository()
		const accessControl = new WorkoutAccessControlService(accessControlRepo)
		const exerciseService = new ExerciseService(exerciseRepo, accessControl)
		const exerciseController = new ExerciseController(exerciseService)

		return exerciseController
	}
}
