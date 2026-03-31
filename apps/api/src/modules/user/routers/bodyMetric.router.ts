import { Router } from 'express'
import { ensureAuthenticated } from 'apps/api/src/middlewares/ensureAuthenticated.js'
import { BodyMetricRepository } from '../repositories/bodyMetric.repository.js'
import { BodyMetricService } from '../services/bodyMetric.service.js'
import { BodyMetricController } from '../controllers/bodyMetric.controller.js'

const bodyMetricRoutes = Router()
const bodyMetricRepo = new BodyMetricRepository()
const bodyMetricService = new BodyMetricService(bodyMetricRepo)
const bodyMetricController = new BodyMetricController(bodyMetricService)

bodyMetricRoutes.use(ensureAuthenticated)

bodyMetricRoutes.post('/', bodyMetricController.create)
bodyMetricRoutes.get('/:id', bodyMetricController.findById)
bodyMetricRoutes.get('/', bodyMetricController.findAll)
bodyMetricRoutes.put('/:id', bodyMetricController.update)
bodyMetricRoutes.delete('/:id', bodyMetricController.delete)

export { bodyMetricRoutes }
