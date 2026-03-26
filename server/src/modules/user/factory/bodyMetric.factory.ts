import { BodyMetricRepository } from '../repositories/bodyMetric.repository.js'
import { BodyMetricService } from '../services/bodyMetric.service.js'
import { BodyMetricController } from '../controllers/bodyMetric.controller.js'

export class BodyMetricFactory {
	static createController() {
		const bodyMetricRepository = new BodyMetricRepository()
		const bodyMetricService = new BodyMetricService(bodyMetricRepository)
		return new BodyMetricController(bodyMetricService)
	}
}
