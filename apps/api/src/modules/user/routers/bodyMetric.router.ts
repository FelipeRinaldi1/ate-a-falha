import { Router } from 'express'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'
import { BodyMetricRepository } from '../repositories/bodyMetric.repository.js'
import { BodyMetricService } from '../services/bodyMetric.service.js'
import { BodyMetricController } from '../controllers/bodyMetric.controller.js'

const bodyMetricRouter = Router()
const bodyMetricRepo = new BodyMetricRepository()
const bodyMetricService = new BodyMetricService(bodyMetricRepo)
const bodyMetricController = new BodyMetricController(bodyMetricService)

bodyMetricRouter.use(ensureAuthenticated)

bodyMetricRouter.post('/', bodyMetricController.create)
bodyMetricRouter.get('/:id', bodyMetricController.findById)
bodyMetricRouter.get('/', bodyMetricController.findAll)
bodyMetricRouter.put('/:id', bodyMetricController.update)
bodyMetricRouter.delete('/:id', bodyMetricController.delete)

export { bodyMetricRouter }
