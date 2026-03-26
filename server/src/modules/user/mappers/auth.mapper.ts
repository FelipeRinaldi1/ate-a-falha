import { Auth } from '@/generated/prisma/client.js'
import { AuthEntity } from '../entities/auth.entity.js'

export class AuthMapper {
	static toEntity(auth: Auth, hidePassword = true): AuthEntity {
		const { password, ...rest } = auth
		return {
			...rest,
			password: hidePassword ? undefined : password,
		}
	}
}
