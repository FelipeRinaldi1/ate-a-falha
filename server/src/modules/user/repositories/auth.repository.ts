import { prisma } from '@/@infra/prisma.client.js'
import { safeCall } from '@/@infra/prisma.safeCall.js'
import { AuthEntity } from '../entities.ts/auth.entity.js'
import { IAuthRepository } from '../interfaces/auth.interfaces.js'
import { Result } from '@/@utils/result.js'
import { CreateAuthDTO } from '../schemas/auth.schema.js'

export class AuthRepository implements IAuthRepository {
	async create(data: CreateAuthDTO): Promise<Result<AuthEntity>> {
		const result = await safeCall(
			prisma.auth.create({
				data: {
					...data,
				},
			})
		)
	}
}
