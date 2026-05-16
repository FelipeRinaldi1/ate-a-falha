import request from 'supertest'
import app from '../../app.js'
import { CreateBodyMetricDTO } from '@ate-a-falha/shared'
import { overrideBodyMetricMock } from '../mocks/bodyMetrics.mock.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'

export const setupTestBodyMetric = async (userId: string, cookie: string, overrides?: Partial<CreateBodyMetricDTO>) => {
	const bodyMetric = overrideBodyMetricMock(overrides)
	const result = await request(app)
		.post(`${BASE_API_URL}/user/body-metric`)
		.set('Cookie', cookie)
		.send(overrideBodyMetricMock({ ...bodyMetric, userId: userId }))

	return result.body
}
