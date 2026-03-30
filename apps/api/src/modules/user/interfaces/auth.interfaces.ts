import { Result } from '@/@utils/result.js'
import { AuthFull, createAuthDTO, updateAuthDTO } from '../schema/auth.schema.js'

export interface IAuthRepository {
	create(data: createAuthDTO, userId: string): Promise<Result<AuthFull>>
	update(userId: string, data: updateAuthDTO): Promise<Result<AuthFull>>
	delete(userId: string): Promise<Result<void>>
	findById(userId: string): Promise<Result<AuthFull>>
	findByEmail(email: string): Promise<Result<AuthFull>>
}
