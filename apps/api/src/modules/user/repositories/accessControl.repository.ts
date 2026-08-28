import { prisma, safeCall } from '@ate-a-falha/database'
import { failure, type Result, success } from '@ate-a-falha/shared'
import { IUserAccessControlRepository } from '../interfaces/accessControl.interface.js'

export class UserAccessControlRepository implements IUserAccessControlRepository {
	async canAccessBodyMetric(bodyMetricId: string, userId: string): Promise<Result<boolean>> {
		const result = await safeCall(
			prisma.bodyMetric.findFirstOrThrow({
				where: {
					id: bodyMetricId,
					userId: userId,
				},
				select: { id: true },
			})
		)
		if (result.isFailure()) return failure(result.error)

		return success(true)
	}
}
