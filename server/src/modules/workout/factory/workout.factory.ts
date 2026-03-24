import { WorkoutRepository } from '../repositories/workout.repository.js'
import { WorkoutService } from '../services/workout.service.js'
import { WorkoutController } from '../controllers/workout.controller.js'
import { WorkoutAccessControlRepository } from '../repositories/accessControl.repository.js'
import { WorkoutAccessControlService } from '../services/accessControl.service.js'

export class WorkoutFactory {
	static createController() {
		const accessRepo = new WorkoutAccessControlRepository()
		const accessService = new WorkoutAccessControlService(accessRepo)

		const workoutRepo = new WorkoutRepository()

		const workoutService = new WorkoutService(workoutRepo, accessService)

		const workoutController = new WorkoutController(workoutService)

		return workoutController
	}
}
