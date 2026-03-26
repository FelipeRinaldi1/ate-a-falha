import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { UserEntity } from '../entities/user.entity.js'
import { IUserRepository } from '../interfaces/user.interfaces.js'
import { Result, success, failure } from '@/@utils/result.js'
import { createUserDTO, updateUserDTO } from '../DTOs/user.schema.js'
import { UserMapper } from '../mappers/user.mapper.js'

export class UserRepository implements IUserRepository {
	async create(data: createUserDTO): Promise<Result<UserEntity>> {
		const result = await safeCall(
			prisma.user.create({
				data,
				include: { auth: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(UserMapper.toEntity(result.value))
	}

	async update(id: string, data: updateUserDTO): Promise<Result<UserEntity>> {
		const result = await safeCall(
			prisma.user.update({
				where: { id },
				data: {
					name: data.name,
					birthDate: data.birthDate,
					gender: data.gender,
					role: data.role,
				},
				include: { auth: true },
			})
		)
		if (result.isFailure()) return failure(result.error)
		return success(UserMapper.toEntity(result.value))
	}

	async delete(id: string): Promise<Result<void>> {
		const result = await safeCall(prisma.user.delete({ where: { id } }))
		if (result.isFailure()) return failure(result.error)
		return success(undefined)
	}

	async findById(id: string): Promise<Result<UserEntity>> {
		const result = await safeCall(prisma.user.findUniqueOrThrow({ where: { id }, include: { auth: true } }))
		if (result.isFailure()) return failure(result.error)
		return success(UserMapper.toEntity(result.value))
	}

	async findAll(): Promise<Result<UserEntity[]>> {
		const result = await safeCall(prisma.user.findMany({ include: { auth: true } }))
		if (result.isFailure()) return failure(result.error)
		return success(result.value.map(UserMapper.toEntity))
	}
}
