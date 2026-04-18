import { prisma } from '@ate-a-falha/database'
import { safeCall } from '@ate-a-falha/database'
import { IUserRepository } from '../interfaces/user.interfaces.js'
import { Result, success, failure } from '@ate-a-falha/shared'

import { CreateUserDTO, UpdateUserDTO } from '@ate-a-falha/shared'
import { UserFull } from '@ate-a-falha/database'

export class UserRepository implements IUserRepository {
	async create(data: CreateUserDTO): Promise<Result<UserFull>> {
		const result = await safeCall(
			prisma.user.create({
				data,
				include: { auth: true, bodyMetrics: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async update(id: string, data: UpdateUserDTO): Promise<Result<UserFull>> {
		const result = await safeCall(
			prisma.user.update({
				where: { id },
				data: {
					name: data.name,
					birthDate: data.birthDate,
					gender: data.gender,
					role: data.role,
				},
				include: { auth: true, bodyMetrics: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async delete(id: string): Promise<Result<void>> {
		const result = await safeCall(prisma.user.delete({ where: { id } }))
		if (result.isFailure()) return failure(result.error)
		return success(undefined)
	}

	async findById(id: string): Promise<Result<UserFull>> {
		const result = await safeCall(
			prisma.user.findUniqueOrThrow({ where: { id }, include: { auth: true, bodyMetrics: true } })
		)
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findAll(): Promise<Result<UserFull[]>> {
		const result = await safeCall(prisma.user.findMany({ include: { auth: true, bodyMetrics: true } }))
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
}
