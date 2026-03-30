import { Result } from '@/@utils/result.js'
import { UserFull, createUserDTO, updateUserDTO } from '../schema/user.schema.js'

export interface IUserRepository {
	create(data: createUserDTO): Promise<Result<UserFull>>
	update(id: string, data: updateUserDTO): Promise<Result<UserFull>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<UserFull>>
	findAll(): Promise<Result<UserFull[]>>
}
