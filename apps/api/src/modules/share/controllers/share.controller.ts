import type { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'
import { ShareService } from '../services/share.service.js'

export class ShareController {
	constructor(private readonly shareService: ShareService = new ShareService()) {}

	lookup = async (req: Request, res: Response, next: NextFunction) => {
		const rawCode = String(req.params.code || '')
		const result = await this.shareService.lookupByCode(rawCode)

		if (result.isFailure()) {
			return next(result.error)
		}

		return res.status(HTTP_STATUS.OK).json(result.value)
	}
}
