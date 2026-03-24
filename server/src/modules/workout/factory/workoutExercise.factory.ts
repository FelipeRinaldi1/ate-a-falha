import { WorkoutExerciseRepository } from '../repositories/workoutExercise.repository.js'
import { WorkoutExerciseService } from '../services/workoutExercise.service.js'
import { WorkoutExerciseController } from '../controllers/workoutExercise.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'

export class WorkoutExerciseFactory {
	static createController() {
		const accessRepo = new WorkoutAccessControlRepository()
		const accessService = new WorkoutAccessControlService(accessRepo)

		const workoutExerciseRepo = new WorkoutExerciseRepository()

		const workoutExerciseService = new WorkoutExerciseService(workoutExerciseRepo, accessService)

		const workoutExerciseController = new WorkoutExerciseController(workoutExerciseService)

		return workoutExerciseController
	}
}
