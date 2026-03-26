import { Result } from '@/@utils/result.js'
import { AuthEntity } from '../entities.ts/auth.entity.js'
import { CreateAuthDTO, UpdateAuthDTO } from '../schemas/auth.schema.js'

export interface IAuthRepository {
	create(data: CreateAuthDTO): Promise<Result<AuthEntity>>
	update(data: UpdateAuthDTO, userId: string): Promise<Result<AuthEntity>>
	delete(id: string, userId: string): Promise<Result<AuthEntity>>
	findById(id: string, userId: string): Promise<Result<AuthEntity>>

	findByEmail(email: string): Promise<Result<AuthEntity>>
}
