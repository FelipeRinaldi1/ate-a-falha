import { AuthEntity } from '../entities.ts/auth.entity.js'
import { Auth } from '@/generated/prisma/client.js'

export class authMapper {
	static toEntity(auth: Auth): AuthEntity {
		return {
			id: auth.id,
			email: auth.email,
			password: auth.password,
			userId: auth.userId,
			createdAt: auth.createdAt,
			updatedAt: auth.updatedAt,
		}
	}
}
