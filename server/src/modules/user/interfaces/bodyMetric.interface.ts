import { createBodyMetricDTO, bodyMetricSearchDTO, updateBodyMetricDTO } from '../DTOs/bodyMetric.schema.js'
import { BodyMetricEntity } from '../entities/bodyMetric.entity.js'
import { Result } from '../../../@utils/result.js'

export interface IBodyMetricRepository {
	create(data: createBodyMetricDTO, userId: string): Promise<Result<BodyMetricEntity>>
	findAll(data: bodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricEntity[]>>
	findById(id: string, userId: string): Promise<Result<BodyMetricEntity>>
	update(id: string, data: updateBodyMetricDTO, userId: string): Promise<Result<BodyMetricEntity>>
	delete(id: string, userId: string): Promise<Result<void>>
}
