import { User, Auth } from '@/generated/prisma/client.js'
import { UserEntity } from '../entities/user.entity.js'
import { AuthMapper } from './auth.mapper.js'

type UserWithAuth = User & { auth?: Auth | null }

export class UserMapper {
	static toEntity(user: UserWithAuth): UserEntity {
		return {
			id: user.id,
			role: user.role,
			name: user.name,
			birthDate: user.birthDate,
			gender: user.gender,
			auth: user.auth ? AuthMapper.toEntity(user.auth) : undefined,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		}
	}
}
