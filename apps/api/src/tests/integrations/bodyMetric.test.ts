import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { overrideBodyMetricMock, updateBodyMetricMocK } from '../mocks/bodyMetrics.mock.js'
import { setupTestBodyMetric } from '../helpers/bodyMetric.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../app.js'
import { BodyMetricDTO } from '@ate-a-falha/shared'

describe('Body Metric Tests', () => {
	let userContext: Awaited<ReturnType<typeof setupTestUser>>
	let bodyMetricContext: Awaited<ReturnType<typeof setupTestBodyMetric>>

	beforeEach(async () => {
		userContext = await setupTestUser()
		bodyMetricContext = await setupTestBodyMetric(userContext.cookie || '')
	})
	afterEach(async () => {
		if (userContext) {
			await cleanupTestUser(userContext.user.id, userContext.cookie)
		}
	})

	describe('POST /body-metrics', () => {
		test('Should create a body metric', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock())

			expect(result.status).toBe(201)
		})
		test('Should not create a BodyMetric with invalid data', async () => {
			const invalidData = {
				weight: -50,
				height: -20,
				activityLevel: -7,
				bodyFat: -3000,
				muscleRate: -5000,
			}
			const data = overrideBodyMetricMock({ ...invalidData })

			const result = await request(app)
				.post(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock(data))

			expect(result.status).toBe(400)
		})
	})

	describe('GET /body-metrics/:id', () => {
		test('Should get a body metric by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/users/body-metrics/${bodyMetricContext.id}`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(200)
		})
		test('Should not get a body metric by a Invalid ID', async () => {
			const id = 'InvalidID'
			const result = await request(app)
				.get(`${BASE_API_URL}/users/body-metrics/${id}`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(400)
		})
	})

	describe('GET /body-metrics', () => {
		test('Should return a valid array with the correct amount of metrics', async () => {
			await request(app)
				.post(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock())

			await request(app)
				.post(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock())

			const result = await request(app)
				.get(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBeGreaterThanOrEqual(2)
		})

		test('Should contain the specific created metrics with correct IDs and user ownership', async () => {
			const bodyMetric1 = await request(app)
				.post(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock())

			const bodyMetric2 = await request(app)
				.post(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock())

			const result = await request(app)
				.get(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send()

			const bodyMetric1Data = bodyMetric1.body
			const bodyMetric2Data = bodyMetric2.body
			const resultData: BodyMetricDTO[] = result.body

			expect(resultData).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: bodyMetric1Data.id,
						userId: bodyMetric1Data.userId,
					}),
					expect.objectContaining({
						id: bodyMetric2Data.id,
						userId: bodyMetric2Data.userId,
					}),
				])
			)
		})

		test('Should return an empty array if the user has no body metrics registered', async () => {
			const cleanUser = await setupTestUser()

			const result = await request(app)
				.get(`${BASE_API_URL}/users/body-metrics`)
				.set('Cookie', cleanUser.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body).toHaveLength(0)

			await cleanupTestUser(cleanUser.user.id, cleanUser.cookie)
		})
	})

	describe('PATCH /body-metrics/:id', () => {
		test('Should update body-metric data', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/users/body-metrics/${bodyMetricContext.id}`)
				.set('Cookie', userContext.cookie || '')
				.send(updateBodyMetricMocK)

			expect(result.status).toBe(200)
		})
	})

	describe('DELETE /body-metrics/:id', () => {
		test('Should delete body-metric data', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/users/body-metrics/${bodyMetricContext.id}`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(200)
		})
	})
})
