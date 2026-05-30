import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { setupTestNutritionContext, cleanupTestNutritionContext } from '../helpers/nutrition.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('MealLog Integration Tests', () => {
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

	describe('POST /nutrition/diet-logs/:dietLogId/meals', () => {
		test('Should create a meal log entry', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diet-logs/${nutrition1Context.dietLog.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Jantar',
					time: '20:00',
					orderIndex: 2,
				})

			expect(result.status).toBe(201)
			expect(result.body.name).toBe('Jantar')
			expect(result.body.time).toBe('20:00')
			expect(result.body.orderIndex).toBe(2)
			expect(result.body.dietLogId).toBe(nutrition1Context.dietLog.id)
		})

		test('Should fail if creating meal log inside another user\'s diet log', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diet-logs/${nutrition2Context.dietLog.id}/meals`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to add to User 2's diet log
				.send({
					name: 'Jantar',
					time: '20:00',
					orderIndex: 2,
				})

			expect(result.status).toBe(403)
		})

		test('Should fail if time format is invalid', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diet-logs/${nutrition1Context.dietLog.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Jantar',
					time: '25:61', // Invalid time
					orderIndex: 2,
				})

			expect(result.status).toBe(400)
		})
	})

	describe('GET /nutrition/diet-logs/:dietLogId/meals', () => {
		test('Should return list of meals in a diet log', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diet-logs/${nutrition1Context.dietLog.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBeGreaterThanOrEqual(1)
			expect(result.body[0].name).toBe('Almoço')
		})

		test('Should forbid retrieving another user\'s meal log list', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diet-logs/${nutrition2Context.dietLog.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('GET /nutrition/meal-logs/:id', () => {
		test('Should fetch a single meal log entry by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meal-logs/${nutrition1Context.mealLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(nutrition1Context.mealLog.id)
			expect(result.body.name).toBe('Almoço')
		})

		test('Should forbid fetching a meal log entry belonging to another user', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meal-logs/${nutrition2Context.mealLog.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to fetch User 2's meal log
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /nutrition/meal-logs/:id', () => {
		test('Should update meal log entry details', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/meal-logs/${nutrition1Context.mealLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Almoço Especial',
					time: '12:30',
				})

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('Almoço Especial')
			expect(result.body.time).toBe('12:30')
		})

		test('Should forbid updating a meal log entry belonging to another user', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/meal-logs/${nutrition2Context.mealLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Almoço Especial',
					time: '12:30',
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /nutrition/meal-logs/:id', () => {
		test('Should delete meal log entry', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/meal-logs/${nutrition1Context.mealLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify from DB that it's gone
			const dbLog = await prisma.mealLog.findUnique({
				where: { id: nutrition1Context.mealLog.id },
			})
			expect(dbLog).toBeNull()
		})

		test('Should forbid deleting a meal log entry belonging to another user', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/meal-logs/${nutrition2Context.mealLog.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})
})
