import { Result } from '@/@utils/result.js'
import { AuthEntity } from '../entities/auth.entity.js'
import { createAuthDTO, updateAuthDTO } from '../DTOs/auth.schema.js'

export interface IAuthRepository {
	create(data: createAuthDTO, userId: string): Promise<Result<AuthEntity>>
	update(userId: string, data: updateAuthDTO): Promise<Result<AuthEntity>>
	delete(userId: string): Promise<Result<void>>
	findById(userId: string): Promise<Result<AuthEntity>>
	findByEmail(email: string): Promise<Result<AuthEntity>>
}
