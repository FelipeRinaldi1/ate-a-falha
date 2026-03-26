import { BodyMetric } from '@/generated/prisma/client.js'
import { BodyMetricEntity } from '../entities/bodyMetric.entity.js'

export class BodyMetricMapper {
	static toEntity(prismaBodyMetric: BodyMetric): BodyMetricEntity {
		return {
			id: prismaBodyMetric.id,
			weight: prismaBodyMetric.weight,
			height: prismaBodyMetric.height,
			activityLevel: prismaBodyMetric.activityLevel,
			bodyFat: prismaBodyMetric.bodyFat,
			muscleRate: prismaBodyMetric.muscleRate,
			userId: prismaBodyMetric.userId,
			createdAt: prismaBodyMetric.createdAt,
			updatedAt: prismaBodyMetric.updatedAt,
		}
	}
}
