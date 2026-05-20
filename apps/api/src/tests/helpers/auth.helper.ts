import { getCreateUserMock } from '../mocks/auth.mock.js'
import request from 'supertest'
import app from '../../app.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'

export const setupTestUser = async () => {
	const userToRegister = getCreateUserMock()

	const register = await request(app).post(`${BASE_API_URL}/user/register`).send(userToRegister)

	return {
		cookie: register.header['set-cookie' as string],
		user: register.body.user,
		originalData: userToRegister,
	}
}

export const cleanupTestUser = async (userId: string | undefined, cookie: string | undefined) => {
	if (userId && cookie) {
		await request(app).delete(`${BASE_API_URL}/user/me`).set('Cookie', cookie).send({ id: userId })
	}
}
