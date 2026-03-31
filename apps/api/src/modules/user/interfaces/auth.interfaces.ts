import { Result } from "@ate-a-falha/shared"

import { CreateAuthDTO } from "@ate-a-falha/shared"
import { AuthFull } from "@ate-a-falha/database"


export interface IAuthRepository {
	create(data: CreateAuthDTO, userId: string): Promise<Result<AuthFull>>
	delete(userId: string): Promise<Result<void>>
	findById(userId: string): Promise<Result<AuthFull>>
	findByEmail(email: string): Promise<Result<AuthFull>>
	updatePassword(userId: string, newPasswordHash: string): Promise<Result<AuthFull>>
	updateEmail(userId: string, newEmail: string): Promise<Result<AuthFull>>
}
