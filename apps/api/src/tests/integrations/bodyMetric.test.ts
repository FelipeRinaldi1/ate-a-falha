import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { overrideBodyMetricMock } from '../mocks/bodyMetrics.mock.js'
import { setupTestBodyMetric } from '../helpers/bodyMetric.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../app.js'

describe('Body Metric Tests', () => {
	let userContext: Awaited<ReturnType<typeof setupTestUser>>
	let bodyMetricContext: Awaited<ReturnType<typeof setupTestBodyMetric>>

	beforeEach(async () => {
		userContext = await setupTestUser()
		bodyMetricContext = await setupTestBodyMetric()
	})
	afterEach(async () => {
		if (userContext) {
			await cleanupTestUser(userContext.user.id, userContext.cookie)
		}
	})

	describe('POST /body-metrics', () => {
		test('Should create a body metric', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/user/body-metrics`)
				.set('Cookie', userContext.cookie || '')
				.send(overrideBodyMetricMock({ userId: userContext.user.id }))

			expect(result.status).toBe(201)
		})
	})
})
