import { createBodyMetricDTO, bodyMetricSearchDTO, updateBodyMetricDTO, BodyMetricFull } from '../schema/bodyMetric.schema.js'
import { IBodyMetricRepository } from '../interfaces/bodyMetric.interface.js'
import { success, failure, Result } from '@/@utils/result.js'

export class BodyMetricService {
	constructor(private bodyMetricRepository: IBodyMetricRepository) {}

	async create(data: createBodyMetricDTO, userId: string): Promise<Result<BodyMetricFull>> {
		const result = await this.bodyMetricRepository.create(data, userId)
		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async findById(id: string, userId: string): Promise<Result<BodyMetricFull>> {
		const result = await this.bodyMetricRepository.findById(id, userId)

		if (result.isFailure()) return failure({
			type: 'NOT_FOUND',
			message: 'Body metric not found or access denied.',
		})

		return success(result.value)
	}

	async findAll(data: bodyMetricSearchDTO, userId: string): Promise<Result<BodyMetricFull[]>> {
		const result = await this.bodyMetricRepository.findAll(data, userId)

		if (result.isFailure()) {
			return failure(result.error)
		}
		return success(result.value)
	}

	async update(
		id: string,
		data: updateBodyMetricDTO,
		userId: string
	): Promise<Result<BodyMetricFull>> {

		const result = await this.bodyMetricRepository.update(id, data, userId)

		if (result.isFailure()) return failure({
			type: 'NOT_FOUND',
			message: 'Body metric not found or access denied for update.',
		})
		return success(result.value)
	}

	async delete(id: string, userId: string): Promise<Result<void>> {
		const result = await this.bodyMetricRepository.delete(id, userId)

		if (result.isFailure()) return failure({
			type: 'NOT_FOUND',
			message: 'Body metric not found or access denied for deletion.',
		})

		return success(result.value)
	}
}
