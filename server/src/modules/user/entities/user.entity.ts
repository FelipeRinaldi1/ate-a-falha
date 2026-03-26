import { AuthEntity } from './auth.entity.js'

export interface UserEntity {
	id: string
	role: 'USER' | 'ADMIN'
	name: string
	birthDate: Date
	gender: 'MALE' | 'FEMALE' | 'OTHER'
	auth?: AuthEntity
	createdAt: Date
	updatedAt: Date
}
