import request from 'supertest'
import app from '../../app.js'
import { CreateBodyMetricDTO } from '@ate-a-falha/shared'
import { overrideBodyMetricMock } from '../mocks/bodyMetrics.mock.js'

export const setupTestBodyMetric = async (overrides?: Partial<CreateBodyMetricDTO>) => {
	const bodyMetric = overrideBodyMetricMock(overrides)
	const result = await request(app).post('/body-metrics').send(bodyMetric)

	return result.body
}
