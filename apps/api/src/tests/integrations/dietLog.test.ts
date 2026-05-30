import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { setupTestNutritionContext, cleanupTestNutritionContext } from '../helpers/nutrition.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('DietLog Integration Tests', () => {
	let user1Context: Awaited<ReturnType<typeof setupTestUser>>
	let user2Context: Awaited<ReturnType<typeof setupTestUser>>
	let nutrition1Context: Awaited<ReturnType<typeof setupTestNutritionContext>>
	let nutrition2Context: Awaited<ReturnType<typeof setupTestNutritionContext>>

	beforeEach(async () => {
		user1Context = await setupTestUser()
		user2Context = await setupTestUser()
		nutrition1Context = await setupTestNutritionContext(user1Context.user.id)
		nutrition2Context = await setupTestNutritionContext(user2Context.user.id)
	})

	afterEach(async () => {
		if (user1Context) {
			await cleanupTestNutritionContext(nutrition1Context.dietLog.id, nutrition1Context.food.id)
			await cleanupTestUser(user1Context.user.id, user1Context.cookie)
		}
		if (user2Context) {
			await cleanupTestNutritionContext(nutrition2Context.dietLog.id, nutrition2Context.food.id)
			await cleanupTestUser(user2Context.user.id, user2Context.cookie)
		}
	})

	describe('POST /nutrition/diet-logs', () => {
		test('Should create a diet log entry', async () => {
			const testDate = new Date()
			testDate.setUTCDate(testDate.getUTCDate() + 1)
			testDate.setUTCHours(0, 0, 0, 0)

			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diet-logs`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					date: testDate.toISOString(),
				})

			expect(result.status).toBe(201)
			expect(new Date(result.body.date).toISOString()).toBe(testDate.toISOString())
			expect(result.body.userId).toBe(user1Context.user.id)

			// Clean up created log
			await prisma.dietLog.delete({ where: { id: result.body.id } }).catch(() => {})
		})

		test('Should fail if creating duplicate diet log for the same date', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diet-logs`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					date: nutrition1Context.dietLog.date.toISOString(),
				})

			expect(result.status).toBe(409) // Prisma unique constraint error (Conflict)
		})

		test('Should fail if date is invalid', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diet-logs`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					date: 'invalid-date-string',
				})

			expect(result.status).toBe(400)
		})
	})

	describe('GET /nutrition/diet-logs', () => {
		test('Should return list of diet logs belonging to user', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diet-logs`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(nutrition1Context.dietLog.id)
		})
	})

	describe('GET /nutrition/diet-logs/:id', () => {
		test('Should fetch a single diet log entry by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diet-logs/${nutrition1Context.dietLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(nutrition1Context.dietLog.id)
		})

		test('Should forbid fetching a diet log entry belonging to another user', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diet-logs/${nutrition2Context.dietLog.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to fetch User 2's diet log
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /nutrition/diet-logs/:id', () => {
		test('Should update diet log details', async () => {
			const testDate = new Date()
			testDate.setUTCDate(testDate.getUTCDate() + 2)
			testDate.setUTCHours(0, 0, 0, 0)

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/diet-logs/${nutrition1Context.dietLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					date: testDate.toISOString(),
				})

			expect(result.status).toBe(200)
			expect(new Date(result.body.date).toISOString()).toBe(testDate.toISOString())
		})

		test('Should forbid updating a diet log entry belonging to another user', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/diet-logs/${nutrition2Context.dietLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					date: new Date().toISOString(),
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /nutrition/diet-logs/:id', () => {
		test('Should delete diet log entry and all nested meals/foods due to cascading', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/diet-logs/${nutrition1Context.dietLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify from DB that the diet log is deleted
			const dbDietLog = await prisma.dietLog.findUnique({
				where: { id: nutrition1Context.dietLog.id },
			})
			expect(dbDietLog).toBeNull()

			// Verify that the meal log associated is also deleted automatically
			const dbMealLog = await prisma.mealLog.findUnique({
				where: { id: nutrition1Context.mealLog.id },
			})
			expect(dbMealLog).toBeNull()
		})

		test('Should forbid deleting a diet log entry belonging to another user', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/diet-logs/${nutrition2Context.dietLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})
})
