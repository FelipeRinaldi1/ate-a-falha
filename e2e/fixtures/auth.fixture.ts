import { test as base, expect } from '@playwright/test'
import { cleanupUserById } from './db.helper'

export interface TestUserSession {
	id: string
	name: string
	email: string
	password: string
	birthDate: string
	gender: 'MALE' | 'FEMALE'
}

const API_BASE = 'http://localhost:3333/api/v1'

export const test = base.extend<{
	authUser: TestUserSession
}>({
	authUser: async ({ page }, use) => {
		const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
		const email = `e2e.user.${uniqueSuffix}@ateafalha.com.br`
		const password = 'Password123!'
		const name = `Atleta E2E ${uniqueSuffix.slice(-4)}`
		const birthDate = '1998-05-15'
		const gender = 'MALE' as const

		// 1. Register user via API using page.request (shares cookie jar with browser page)
		const regRes = await page.request.post(`${API_BASE}/users/register`, {
			data: {
				name,
				birthDate,
				gender,
				role: 'USER',
				auth: {
					email,
					password,
				},
			},
		})
		expect(regRes.ok()).toBeTruthy()
		const regBody = await regRes.json()
		const userId: string = regBody.user.id

		// 2. Register initial body metric (80kg, 180cm, Moderado = 2)
		const metricRes = await page.request.post(`${API_BASE}/users/body-metrics`, {
			data: {
				weight: 80,
				height: 180,
				activityLevel: 2,
				bodyFat: 15,
				muscleRate: 40,
			},
		})
		expect(metricRes.ok()).toBeTruthy()

		const session: TestUserSession = {
			id: userId,
			name,
			email,
			password,
			birthDate,
			gender,
		}

		await use(session)

		// Teardown: cascade delete user and all records from PostgreSQL
		await cleanupUserById(userId)
	},
})

export { expect }
