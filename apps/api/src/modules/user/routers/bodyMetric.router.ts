import { Router } from 'express'
import { ensureAuthenticated } from '@/middlewares/ensureAuthenticated.js'
import { BodyMetricRepository } from '../repositories/bodyMetric.repository.js'
import { UserRepository } from '../repositories/user.repository.js'
import { UserAccessControlRepository } from '../repositories/accessControl.repository.js'
import { UserAccessControlService } from '../services/userAccessControl.service.js'
import { BodyMetricService } from '../services/bodyMetric.service.js'
import { BodyMetricController } from '../controllers/bodyMetric.controller.js'

const bodyMetricRouter = Router()
const bodyMetricRepo = new BodyMetricRepository()
const userRepo = new UserRepository()
const accessRepo = new UserAccessControlRepository()
const accessService = new UserAccessControlService(accessRepo)
const bodyMetricService = new BodyMetricService(bodyMetricRepo, userRepo, accessService)
const bodyMetricController = new BodyMetricController(bodyMetricService)

bodyMetricRouter.use(ensureAuthenticated)

bodyMetricRouter.post('/body-metrics', bodyMetricController.create)
bodyMetricRouter.get('/body-metrics', bodyMetricController.findAll)
bodyMetricRouter.get('/body-metrics/:id', bodyMetricController.findById)
bodyMetricRouter.patch('/body-metrics/:id', bodyMetricController.update)
bodyMetricRouter.delete('/body-metrics/:id', bodyMetricController.delete)

export { bodyMetricRouter }
