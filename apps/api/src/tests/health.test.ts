import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('Debug Health Check', () => {
	it('should return 200 from /health', async () => {
		const response = await request(app).get('/health')
		console.log('Health Check Response Body:', response.body)
		expect(response.status).toBe(200)
	})
})
