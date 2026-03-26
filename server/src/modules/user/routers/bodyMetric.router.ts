import { Router } from 'express'
import { BodyMetricFactory } from '../factory/bodyMetric.factory.js'
import { ensureAuthenticated } from '@/@middlewares/ensureAuthenticated.js'

const bodyMetricRoutes = Router()
const bodyMetricController = BodyMetricFactory.createController()

bodyMetricRoutes.use(ensureAuthenticated)

bodyMetricRoutes.post('/', bodyMetricController.create)
bodyMetricRoutes.get('/:id', bodyMetricController.findById)
bodyMetricRoutes.get('/', bodyMetricController.findAll)
bodyMetricRoutes.put('/:id', bodyMetricController.update)
bodyMetricRoutes.delete('/:id', bodyMetricController.delete)

export { bodyMetricRoutes }
