import { type Result, type CreateUserWithAuthDTO, type UpdateUserDTO, type authenticatedUser } from '@ate-a-falha/shared'
import { type UserFull } from '@ate-a-falha/database'

export interface IUserRepository {
	create(data: CreateUserWithAuthDTO): Promise<Result<UserFull>>
	update(id: string, data: UpdateUserDTO): Promise<Result<UserFull>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<UserFull>>
	findAuthContextById(id: string): Promise<Result<authenticatedUser>>
	findAll(): Promise<Result<UserFull[]>>
}
