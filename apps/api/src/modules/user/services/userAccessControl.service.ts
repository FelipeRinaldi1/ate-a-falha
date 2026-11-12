import { type AppError, failure, type Result, success, type authenticatedUser } from '@ate-a-falha/shared'
import type { IUserAccessControlRepository } from '../interfaces/accessControl.interface.js'

export class UserAccessControlService {
	constructor(private readonly accessRepo: IUserAccessControlRepository) {}

	private readonly ForbiddenError: AppError = {
		type: 'FORBIDDEN',
		message: 'Not found or not authorized',
	}

	private handleAccessResult(result: Result<boolean>): Result<boolean> {
		if (result.isFailure()) {
			if (result.error.type === 'NOT_FOUND') {
				return failure(this.ForbiddenError)
			}
			return failure(result.error)
		}
		if (result.value === false) {
			return failure(this.ForbiddenError)
		}
		return success(true)
	}

	async canAccessBodyMetric(bodyMetricId: string, user: authenticatedUser): Promise<Result<boolean>> {
		if (user.role === 'ADMIN') return success(true)
		const result = await this.accessRepo.canAccessBodyMetric(bodyMetricId, user.id)
		return this.handleAccessResult(result)
	}
}
