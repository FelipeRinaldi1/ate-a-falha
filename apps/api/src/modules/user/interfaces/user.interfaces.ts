import { Result } from "@ate-a-falha/shared"

import { CreateUserDTO, UpdateUserDTO } from "@ate-a-falha/shared"
import { UserFull } from "@ate-a-falha/database"


export interface IUserRepository {
	create(data: CreateUserDTO): Promise<Result<UserFull>>
	update(id: string, data: UpdateUserDTO): Promise<Result<UserFull>>
	delete(id: string): Promise<Result<void>>
	findById(id: string): Promise<Result<UserFull>>
	findAll(): Promise<Result<UserFull[]>>
}
