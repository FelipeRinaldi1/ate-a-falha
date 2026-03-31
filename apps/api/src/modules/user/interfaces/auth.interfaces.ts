import { Result } from "@ate-a-falha/shared"

import { CreateAuthDTO, UpdateAuthDTO } from "@ate-a-falha/shared"
import { AuthFull } from "@ate-a-falha/database"


export interface IAuthRepository {
	create(data: CreateAuthDTO, userId: string): Promise<Result<AuthFull>>
	update(userId: string, data: UpdateAuthDTO): Promise<Result<AuthFull>>
	delete(userId: string): Promise<Result<void>>
	findById(userId: string): Promise<Result<AuthFull>>
	findByEmail(email: string): Promise<Result<AuthFull>>
}
