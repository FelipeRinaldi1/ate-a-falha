import { UserFull } from '@ate-a-falha/database'
import { CreateUserWithAuthDTO, UpdateUserDTO } from '@ate-a-falha/shared'

const userId = crypto.randomUUID()

export const userMock: UserFull = {
	id: userId,
	role: 'USER',
	name: 'userMock',
	birthDate: new Date('2000-01-01'),
	gender: 'MALE',
	createdAt: new Date(),
	updatedAt: new Date(),
	auth: {
		id: crypto.randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		email: 'userMock@gmail.com',
		password: 'userMockPassword1!',
		userId: userId,
	},
}

export const createUserMock: CreateUserWithAuthDTO = {
	name: 'createUser',
	birthDate: new Date('2000-01-01'),
	gender: 'MALE',
	role: 'USER',
	auth: {
		email: 'createUser@gmail.com',
		password: 'createUserPassword1!',
	},
}

export const updateUserMock: UpdateUserDTO = {
	name: 'updatedUser',
	birthDate: new Date('2005-01-01'),
	gender: 'FEMALE',
	role: 'ADMIN',
}
