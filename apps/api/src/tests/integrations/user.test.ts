import app from '../../app.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import request from 'supertest'
import { beforeEach, describe, test, expect, afterEach } from 'vitest'
import { getCreateUserMock, updateUserMock } from '../mocks/auth.mock.js'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'
import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { setupTestBodyMetric } from '../helpers/bodyMetric.helper.js'

describe('user Tests', () => {
	let userContext: Awaited<ReturnType<typeof setupTestUser>>

	beforeEach(async () => {
		userContext = await setupTestUser()
	})
	afterEach(async () => {
		if (userContext) {
			await cleanupTestUser(userContext.user.id, userContext.cookie)
		}
	})

	describe(`POST ${BASE_API_URL}/user/register`, () => {
		test('Should register a user | 201 Created', async () => {
			const createUser = getCreateUserMock()

			const result = await request(app).post(`${BASE_API_URL}/user/register`).send(createUser)

			expect(result.status).toBe(HTTP_STATUS.CREATED)
		})

		test('Should fail if email already exists | 409 Conflict', async () => {
			const data = {
				name: 'TesteUserFail',
				birthDate: new Date('2003-01-01'),
				gender: 'FEMALE',
				role: 'USER',
				auth: {
					email: userContext.originalData.auth.email,
					password: 'Password123!',
				},
			}

			const result = await request(app).post(`${BASE_API_URL}/user/register`).send(data)

			expect(result.status).toBe(HTTP_STATUS.CONFLICT)
		})

		test('Should fail if email doesnt have "@" | 400 Bad Request', async () => {
			const registerUser = {
				...userContext.originalData,
				auth: {
					password: 'Password123!',
					email: 'invalidEmail',
				},
			}

			const result = await request(app).post(`${BASE_API_URL}/user/register`).send(registerUser)

			expect(result.status).toBe(HTTP_STATUS.BAD_REQUEST)
		})
	})

	describe(`POST ${BASE_API_URL}/user/logout`, () => {
		test('Should log out user | 200 OK', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/user/logout`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
	})

	describe(`Post ${BASE_API_URL}/user`, () => {
		test('Should login a user | 200 OK', async () => {
			const result = await request(app).post(`${BASE_API_URL}/user/login`).send(userContext.originalData.auth)

			expect(result.status).toBe(HTTP_STATUS.OK)
		})

		test('Should failf if user doesnt exists | 404 Not Found', async () => {
			const fakeAuth = {
				email: 'fakeemail@gmail.com',
				password: 'fakepassword',
			}
			const result = await request(app).post(`${BASE_API_URL}/user/login`).send(fakeAuth)

			expect(result.status).toBe(HTTP_STATUS.NOT_FOUND)
		})

		test('Should fail if password is incorrect | 404 Not Found', async () => {
			const fakeAuth = {
				email: userContext.originalData.auth.email,
				password: 'fakepassword',
			}
			const result = await request(app).post(`${BASE_API_URL}/user/login`).send(fakeAuth)

			expect(result.status).toBe(HTTP_STATUS.NOT_FOUND)
		})
	})

	describe('GET /me', () => {
		test('Should return user data | 201', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/user/me`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(HTTP_STATUS.OK)
		})

		test('Should fail if cookie isnt valid | 401 Unauthorized', async () => {
			const result = await request(app).get(`${BASE_API_URL}/user/me`).set('Cookie', '').send()

			expect(result.status).toBe(HTTP_STATUS.UNAUTHORIZED)
		})

		test('Should return true in hasBodyMetrics| 200 OK', async () => {
			const bodyMetric = await setupTestBodyMetric(userContext.cookie || '')
			const result = await request(app)
				.get(`${BASE_API_URL}/user/me`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(HTTP_STATUS.OK)
			expect(result.body.hasBodyMetrics).toBe(true)

			await request(app)
				.delete(`${BASE_API_URL}/user/body-metric/${bodyMetric.id}`)
				.set('Cookie', userContext.cookie || '')
				.send()
		})

		test('Should return false in hasBodyMetrics| 200 OK', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/user/me`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(HTTP_STATUS.OK)
			expect(result.body.hasBodyMetrics).toBe(false)
		})
	})

	describe('PUT /me', () => {
		test('Update Me', async () => {
			const result = await request(app)
				.put(`${BASE_API_URL}/user/me`)
				.set('Cookie', userContext.cookie || '')
				.send(updateUserMock)

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
	})

	describe('Patch /me/password', () => {
		test('Change password', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/user/me/password`)
				.set('Cookie', userContext.cookie || '')
				.send({
					oldPassword: userContext.originalData.auth.password,
					newPassword: 'NewPassword123!@',
				})

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
		test('Incorrect old Password', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/user/me/password`)
				.set('Cookie', userContext.cookie || '')
				.send({
					oldPassword: 'IncorrectOldPassword',
					newPassword: 'NewPassword123!@',
				})

			expect(result.status).toBe(HTTP_STATUS.UNAUTHORIZED)
		})
	})
	describe('PATCH /me/email', () => {
		test('Change email', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/user/me/email`)
				.set('Cookie', userContext.cookie || '')
				.send({
					newEmail: 'newEmail@gmail.com',
					password: userContext.originalData.auth.password,
				})

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
		test('Incorrect password', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/user/me/email`)
				.set('Cookie', userContext.cookie || '')
				.send({
					newEmail: 'newEmail@gmail.com',
					password: 'incorrectPassword',
				})

			expect(result.status).toBe(HTTP_STATUS.UNAUTHORIZED)
		})
	})

	describe('DELETE /deleteMe', () => {
		test('/deleteMe', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/user/me`)
				.set('Cookie', userContext.cookie || '')
				.send(userContext.user.id)

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
	})
})
