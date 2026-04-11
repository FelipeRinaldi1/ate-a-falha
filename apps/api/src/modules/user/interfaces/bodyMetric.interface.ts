import { CreateBodyMetricDTO, BodyMetricSearchDTO, UpdateBodyMetricDTO } from "@ate-a-falha/shared"
import { BodyMetricFull } from "@ate-a-falha/database"

import { Result } from '@ate-a-falha/shared'

export interface IBodyMetricRepository {
	create(data: CreateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>>
	findAll(data: BodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricFull[]>>
	findById(id: string, userId: string): Promise<Result<BodyMetricFull>>
	update(id: string, data: UpdateBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>>
	delete(id: string, userId: string): Promise<Result<void>>
}
