import {
	type CreateBodyMetricDTO,
	type BodyMetricSearchDTO,
	type UpdateBodyMetricDTO,
	type Result,
} from '@ate-a-falha/shared'
import { type BodyMetricFull } from '@ate-a-falha/database'

export interface IBodyMetricRepository {
	create(data: CreateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>>
	findAll(data: BodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricFull[]>>
	findById(id: string, userId: string): Promise<Result<BodyMetricFull>>
	update(id: string, data: UpdateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>>
	delete(id: string, userId: string): Promise<Result<void>>
	countBodyMetrics(userId: string): Promise<Result<number>>
}
