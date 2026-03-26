import { Result } from '@/@utils/result.js'
import { UserEntity } from '../entities/user.entity.js'
import { createUserDTO, updateUserDTO } from '../DTOs/user.schema.js'

export interface IUserRepository {
	create(data: createUserDTO): Promise<Result<UserEntity>>
	update(id: string, data: updateUserDTO): Promise<Result<UserEntity>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<UserEntity>>
	findAll(): Promise<Result<UserEntity[]>>
}
