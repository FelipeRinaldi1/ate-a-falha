import { ExerciseRepository } from '../repositories/exercise.repositorie.js'
import { ExerciseService } from '../services/exercise.service.js'
import { ExerciseController } from '../controller/exercise.controller.js'

export class ExerciseFactory {
	static createController(): ExerciseController {
		const exerciseRepo = new ExerciseRepository()
		const exerciseService = new ExerciseService(exerciseRepo)
		const exerciseController = new ExerciseController(exerciseService)

		return exerciseController
	}
}
