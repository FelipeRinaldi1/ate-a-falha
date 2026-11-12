import { Router } from 'express'
import { ShareRepository } from '../repositories/share.repository.js'
import { ShareService } from '../services/share.service.js'
import { ShareController } from '../controllers/share.controller.js'

const shareModuleRouter = Router()
const shareRepository = new ShareRepository()
const shareService = new ShareService(shareRepository)
const shareController = new ShareController(shareService)

shareModuleRouter.get('/lookup/:code', shareController.lookup)

export { shareModuleRouter }
