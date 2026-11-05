import { Router } from 'express'
import { ShareService } from '../services/share.service.js'
import { ShareController } from '../controllers/share.controller.js'

const shareModuleRouter = Router()
const shareService = new ShareService()
const shareController = new ShareController(shareService)

shareModuleRouter.get('/lookup/:code', shareController.lookup)

export { shareModuleRouter }
