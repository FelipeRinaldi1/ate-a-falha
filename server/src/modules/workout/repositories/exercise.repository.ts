import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { CreateExerciseDTO, UpdateExerciseDTO, SearchExerciseDTO } from '../DTOs/exercise.schema.js'
import { IExerciseRepository } from '../interfaces/exercise.interface.js'
import { failure, Result, success } from '@/@utils/result.js'
import { ExerciseEntity } from '../entities/exercise.entity.js'
import { ExerciseMapper } from '../mappers/exercise.mapper.js'

export class ExerciseRepository implements IExerciseRepository {
	async create(data: CreateExerciseDTO): Promise<Result<ExerciseEntity>> {
		const result = await safeCall(
			prisma.exercise.create({
				data: data,
			})
		)

		if (result.isFailure()) return failure(result.error)
		return success(ExerciseMapper.toEntity(result.value))
	}
	async update(id: string, data: UpdateExerciseDTO): Promise<Result<ExerciseEntity>> {
		const result = await safeCall(
			prisma.exercise.update({
				where: { id: id },
				data: data,
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(ExerciseMapper.toEntity(result.value))
	}
	async delete(id: string): Promise<Result<void>> {
		const result = await safeCall(
			prisma.exercise.delete({
				where: { id: id },
			})
		)

		if (result.isFailure()) return failure(result.error)
		return success(undefined)
	}

	async findAll(data: SearchExerciseDTO): Promise<Result<ExerciseEntity[]>> {
		const result = await safeCall(
			prisma.exercise.findMany({
				take: data.take || 10,
				skip: data.cursorId ? 1 : 0,
				cursor: data.cursorId ? { id: data.cursorId } : undefined,
				where: {
					AND: [
						data.name
							? {
									name: { contains: data.name, mode: 'insensitive' },
								}
							: {},
					],
				},
				orderBy: [{ name: 'asc' }, { id: 'asc' }],
			})
		)

		if (result.isFailure()) return result

		const entities = result.value.map((exercise) => ExerciseMapper.toEntity(exercise))
		return success(entities)
	}
	async findById(id: string): Promise<Result<ExerciseEntity>> {
		const result = await safeCall(
			prisma.exercise.findUniqueOrThrow({
				where: { id: id },
			})
		)

		if (result.isFailure()) return result

		return success(ExerciseMapper.toEntity(result.value))
	}
}
