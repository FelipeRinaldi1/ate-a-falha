import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { AuthEntity } from '../entities/auth.entity.js'
import { IAuthRepository } from '../interfaces/auth.interfaces.js'
import { Result, success, failure } from '@/@utils/result.js'
import { createAuthDTO, updateAuthDTO } from '../DTOs/auth.schema.js'
import { AuthMapper } from '../mappers/auth.mapper.js'

export class AuthRepository implements IAuthRepository {
	async create(data: createAuthDTO, userId: string): Promise<Result<AuthEntity>> {
		const result = await safeCall(
			prisma.auth.create({
				data: {
					...data,
					userId,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(AuthMapper.toEntity(result.value))
	}

	async update(userId: string, data: updateAuthDTO): Promise<Result<AuthEntity>> {
		const result = await safeCall(
			prisma.auth.update({
				where: { userId },
				data: {
					...data,
					updatedAt: new Date(),
				},
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(AuthMapper.toEntity(result.value))
	}

	async delete(userId: string): Promise<Result<void>> {
		const result = await safeCall(prisma.auth.delete({ where: { userId } }))
		if (result.isFailure()) return failure(result.error)
		return success(undefined)
	}

	async findById(userId: string): Promise<Result<AuthEntity>> {
		const result = await safeCall(prisma.auth.findUniqueOrThrow({ where: { userId } }))
		if (result.isFailure()) return failure(result.error)
		return success(AuthMapper.toEntity(result.value))
	}

	async findByEmail(email: string): Promise<Result<AuthEntity>> {
		const result = await safeCall(prisma.auth.findUniqueOrThrow({ where: { email } }))
		if (result.isFailure()) return failure(result.error)
		return success(AuthMapper.toEntity(result.value))
	}
}
