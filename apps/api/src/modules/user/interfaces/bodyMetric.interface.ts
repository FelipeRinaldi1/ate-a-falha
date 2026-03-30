import { BodyMetricFull, createBodyMetricDTO, bodyMetricSearchDTO, updateBodyMetricDTO } from '../schema/bodyMetric.schema.js'
import { Result } from '../../../@utils/result.js'

export interface IBodyMetricRepository {
	create(data: createBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>>
	findAll(data: bodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricFull[]>>
	findById(id: string, userId: string): Promise<Result<BodyMetricFull>>
	update(id: string, data: updateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>>
	delete(id: string, userId: string): Promise<Result<void>>
}
