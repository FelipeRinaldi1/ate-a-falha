import { prisma, safeCall } from '@ate-a-falha/database'
import type { Result } from '@ate-a-falha/shared'
import type { IShareRepository, SharedResourceRecord } from '../interfaces/share.interface.js'

export class ShareRepository implements IShareRepository {
	async findExportedPlanByCodePrefix(prefix: string): Promise<Result<SharedResourceRecord | null>> {
		return await safeCall(
			prisma.plan.findFirst({
				where: {
					id: {
						startsWith: prefix,
						mode: 'insensitive',
					},
					isExported: true,
				},
				select: {
					id: true,
					name: true,
				},
			})
		)
	}

	async findExportedDietByCodePrefix(prefix: string): Promise<Result<SharedResourceRecord | null>> {
		return await safeCall(
			prisma.diet.findFirst({
				where: {
					id: {
						startsWith: prefix,
						mode: 'insensitive',
					},
					isExported: true,
				},
				select: {
					id: true,
					name: true,
				},
			})
		)
	}
}
