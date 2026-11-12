import { prisma, safeCall, type UserFull } from '@ate-a-falha/database'
import type { IUserRepository } from '../interfaces/user.interfaces.js'
import {
	type Result,
	success,
	failure,
	type CreateUserWithAuthDTO,
	type UpdateUserDTO,
	type authenticatedUser,
} from '@ate-a-falha/shared'

export class UserRepository implements IUserRepository {
	async create(data: CreateUserWithAuthDTO): Promise<Result<UserFull>> {
		const { auth, ...userData } = data
		const result = await safeCall(
			prisma.user.create({
				data: {
					...userData,
					auth: {
						create: {
							email: auth.email,
							password: auth.password,
						},
					},
				},
				include: { auth: true },
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
				},
				include: { auth: true },
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
		const result = await safeCall(prisma.user.findUniqueOrThrow({ where: { id }, include: { auth: true } }))
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}

	async findAuthContextById(id: string): Promise<Result<authenticatedUser>> {
		const result = await safeCall(
			prisma.user.findUniqueOrThrow({
				where: { id },
				select: { id: true, role: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success({
			id: result.value.id,
			role: result.value.role as 'USER' | 'ADMIN',
		})
	}

	async findAll(): Promise<Result<UserFull[]>> {
		const result = await safeCall(prisma.user.findMany({ include: { auth: true } }))
		if (result.isFailure()) return failure(result.error)
		return success(result.value)
	}
}
