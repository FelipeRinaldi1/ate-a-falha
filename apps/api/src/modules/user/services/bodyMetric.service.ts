import { type CreateBodyMetricDTO, type BodyMetricSearchDTO, type UpdateBodyMetricDTO, type Result, success, failure, type authenticatedUser } from '@ate-a-falha/shared'
import { type BodyMetricFull } from '@ate-a-falha/database'
import type { IBodyMetricRepository } from '../interfaces/bodyMetric.interface.js'

export class BodyMetricService {
	constructor(private readonly bodyMetricRepository: IBodyMetricRepository) {}

	async create(data: CreateBodyMetricDTO, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const result = await this.bodyMetricRepository.create(data, authUser.id)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const result = await this.bodyMetricRepository.findById(id, authUser.id)

		if (result.isFailure())
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied.',
			})

		return success(result.value)
	}

	async findAll(data: BodyMetricSearchDTO, authUser: authenticatedUser): Promise<Result<BodyMetricFull[]>> {
		const result = await this.bodyMetricRepository.findAll(data, authUser.id)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(id: string, data: UpdateBodyMetricDTO, authUser: authenticatedUser): Promise<Result<BodyMetricFull>> {
		const result = await this.bodyMetricRepository.update(id, data, authUser.id)

		if (result.isFailure())
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied for update.',
			})
		return success(result.value)
	}

	async delete(id: string, authUser: authenticatedUser): Promise<Result<void>> {
		const result = await this.bodyMetricRepository.delete(id, authUser.id)

		if (result.isFailure())
			return failure({
				type: 'NOT_FOUND',
				message: 'Body metric not found or access denied for deletion.',
			})

		return success(result.value)
	}
}
