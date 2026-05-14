import app from '../app.js'
import request from 'supertest'
import { afterAll, describe, test, expect } from 'vitest'
import { createUserMock, updateUserMock } from './mocks/auth.mock.js'
import { HTTP_STATUS } from '@/constants/global/httpCodesConstants.js'
import { UserResponseDTO } from '@ate-a-falha/shared'

describe('Authentication Tests', () => {
	let createdUser: UserResponseDTO
	let authCookie: string | undefined

	afterAll(async () => {
		if (createdUser?.id) {
			await request(app)
				.delete('/users/me')
				.set('Cookie', authCookie || '')
				.send(createdUser.id)
		}
	})
	describe('POST /users/register', () => {
		test('Should register a user | 201 Created', async () => {
			const result = await request(app).post('/users/register').send(createUserMock)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.CREATED)

			authCookie = result.header['set-cookie' as string]
			createdUser = result.body.user
		})
		test('Should fail if email already exists | 409 Conflict', async () => {
			const result = await request(app).post('/users/register').send(createUserMock)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.CONFLICT)
		})
	})

	describe('POST /users/logout', () => {
		test('/logout', async () => {
			const result = await request(app)
				.post('/users/logout')
				.set('Cookie', authCookie || '')
				.send()

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
	})
	describe('Post /users/login', () => {
		test('Should login a user | 200 OK', async () => {
			const result = await request(app).post('/users/login').send(createUserMock.auth)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.OK)

			authCookie = result.header['set-cookie' as string]
		})
		test('Should failf if user doesnt exists | 404 Not Found', async () => {
			const fakeAuth = {
				email: 'fakeemail@gmail.com',
				password: 'fakepassword',
			}
			const result = await request(app).post('/users/login').send(fakeAuth)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.NOT_FOUND)
		})
		test('Should fail if password is incorrect | 404 Not Found', async () => {
			const fakeAuth = {
				email: createUserMock.auth.email,
				password: 'fakepassword',
			}
			const result = await request(app).post('/users/login').send(fakeAuth)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.NOT_FOUND)
		})
	})

	describe('GET /me', () => {
		test('/getMe', async () => {
			const result = await request(app)
				.get('/users/me')
				.set('Cookie', authCookie || '')
				.send()

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
	})

	describe('PUT /updateMe', () => {
		test('/updateMe', async () => {
			const result = await request(app)
				.put('/users/me')
				.set('Cookie', authCookie || '')
				.send(updateUserMock)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.OK)
		})
	})

	describe('DELETE /deleteMe', () => {
		test('/deleteMe', async () => {
			const result = await request(app)
				.delete('/users/me')
				.set('Cookie', authCookie || '')
				.send(createdUser.id)

			console.log(result.body)

			expect(result.status).toBe(HTTP_STATUS.OK)

			createdUser = null as any
			authCookie = null as any
		})
	})
})
