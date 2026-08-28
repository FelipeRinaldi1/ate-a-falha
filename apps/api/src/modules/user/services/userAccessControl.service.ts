import { type AppError, failure, type Result, success, type authenticatedUser } from '@ate-a-falha/shared'
import type { IUserAccessControlRepository } from '../interfaces/accessControl.interface.js'

export class UserAccessControlService {
	constructor(private readonly accessRepo: IUserAccessControlRepository) {}

	private readonly NotFoundError: AppError = {
		type: 'NOT_FOUND',
		message: 'Not found or not authorized',
	}

	private handleAccessResult(result: Result<boolean>): Result<boolean> {
		if (result.isFailure()) {
			return failure(this.NotFoundError)
		}
		if (result.value === false) {
			return failure(this.NotFoundError)
		}
		return success(true)
	}

	async canAccessBodyMetric(bodyMetricId: string, user: authenticatedUser): Promise<Result<boolean>> {
		if (user.role === 'ADMIN') return success(true)
		const result = await this.accessRepo.canAccessBodyMetric(bodyMetricId, user.id)
		return this.handleAccessResult(result)
	}
}
