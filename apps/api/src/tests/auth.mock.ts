import { CreateUserWithAuthDTO, UpdateUserDTO } from '@ate-a-falha/shared'

export const getCreateUserMock = (): CreateUserWithAuthDTO => ({
	name: 'createUser',
	birthDate: new Date('2000-01-01'),
	gender: 'MALE',
	role: 'USER',
	auth: {
		email: `test-${Math.random()}@gmail.com`,
		password: 'createUserPassword1!',
	},
})

export const updateUserMock: UpdateUserDTO = {
	name: 'updatedUser',
	birthDate: new Date('2005-01-01'),
	gender: 'FEMALE',
	role: 'ADMIN',
}
