import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { IAuthRepository } from '../interfaces/auth.interfaces.js'
import { Result, success, failure } from "@ate-a-falha/shared"

import { CreateAuthDTO } from "@ate-a-falha/shared"
import { AuthFull } from "@ate-a-falha/database"


export class AuthRepository implements IAuthRepository {
	async create(data: CreateAuthDTO, userId: string): Promise<Result<AuthFull>> {
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
		return success(result.value)
	}

	async updatePassword(userId: string, newPasswordHash: string): Promise<Result<AuthFull>> {
		const result = await safeCall(
			prisma.auth.update({
				where: { userId },
				data: {
					password: newPasswordHash,
					updatedAt: new Date(),
				},
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async updateEmail(userId: string, newEmail: string): Promise<Result<AuthFull>> {
		const result = await safeCall(
			prisma.auth.update({
				where: { userId },
				data: {
					email: newEmail,
					updatedAt: new Date(),
				},
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async delete(userId: string): Promise<Result<void>> {
		const result = await safeCall(prisma.auth.delete({ where: { userId } }))
		if (result.isFailure()) return failure(result.error)
		return success(undefined)
	}

	async findById(userId: string): Promise<Result<AuthFull>> {
		const result = await safeCall(prisma.auth.findUniqueOrThrow({ where: { userId } }))
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findByEmail(email: string): Promise<Result<AuthFull>> {
		const result = await safeCall(prisma.auth.findUniqueOrThrow({ where: { email } }))
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
}
