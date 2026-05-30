import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { setupTestNutritionContext, cleanupTestNutritionContext } from '../helpers/nutrition.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('FoodLog Integration Tests', () => {
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

	describe('POST /nutrition/meal-logs/:mealLogId/foods', () => {
		test('Should add a food log entry to the meal log', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meal-logs/${nutrition1Context.mealLog.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					foodId: nutrition1Context.food.id,
					quantity: 150,
				})

			expect(result.status).toBe(201)
			expect(result.body.quantity).toBe(150)
			expect(result.body.foodId).toBe(nutrition1Context.food.id)
			expect(result.body.mealLogId).toBe(nutrition1Context.mealLog.id)
		})

		test('Should fail if adding food to another user\'s meal log', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meal-logs/${nutrition2Context.mealLog.id}/foods`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to write to User 2's meal log
				.send({
					foodId: nutrition1Context.food.id,
					quantity: 150,
				})

			expect(result.status).toBe(403)
		})

		test('Should fail if quantity is invalid (non-positive)', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meal-logs/${nutrition1Context.mealLog.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					foodId: nutrition1Context.food.id,
					quantity: -50,
				})

			expect(result.status).toBe(400)
		})
	})

	describe('GET /nutrition/meal-logs/:mealLogId/foods', () => {
		test('Should return list of food logs in a meal log', async () => {
			// Add a food log first
			await prisma.foodLog.create({
				data: {
					mealLogId: nutrition1Context.mealLog.id,
					foodId: nutrition1Context.food.id,
					quantity: 200,
				},
			})

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meal-logs/${nutrition1Context.mealLog.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].quantity).toBe(200)
		})

		test('Should forbid retrieving another user\'s food log list', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meal-logs/${nutrition2Context.mealLog.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('GET /nutrition/food-logs/:id', () => {
		test('Should fetch a single food log entry by ID', async () => {
			const log = await prisma.foodLog.create({
				data: {
					mealLogId: nutrition1Context.mealLog.id,
					foodId: nutrition1Context.food.id,
					quantity: 120,
				},
			})

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-logs/${log.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(log.id)
			expect(result.body.quantity).toBe(120)
		})

		test('Should forbid fetching a food log entry belonging to another user', async () => {
			const log = await prisma.foodLog.create({
				data: {
					mealLogId: nutrition2Context.mealLog.id,
					foodId: nutrition2Context.food.id,
					quantity: 120,
				},
			})

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-logs/${log.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to fetch User 2's food log
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /nutrition/food-logs/:id', () => {
		test('Should update food log entry details', async () => {
			const log = await prisma.foodLog.create({
				data: {
					mealLogId: nutrition1Context.mealLog.id,
					foodId: nutrition1Context.food.id,
					quantity: 100,
				},
			})

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-logs/${log.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					quantity: 250,
				})

			expect(result.status).toBe(200)
			expect(result.body.quantity).toBe(250)
		})

		test('Should forbid updating a food log entry belonging to another user', async () => {
			const log = await prisma.foodLog.create({
				data: {
					mealLogId: nutrition2Context.mealLog.id,
					foodId: nutrition2Context.food.id,
					quantity: 100,
				},
			})

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-logs/${log.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					quantity: 250,
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /nutrition/food-logs/:id', () => {
		test('Should delete food log entry', async () => {
			const log = await prisma.foodLog.create({
				data: {
					mealLogId: nutrition1Context.mealLog.id,
					foodId: nutrition1Context.food.id,
					quantity: 100,
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-logs/${log.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify from DB that it's gone
			const dbLog = await prisma.foodLog.findUnique({
				where: { id: log.id },
			})
			expect(dbLog).toBeNull()
		})

		test('Should forbid deleting a food log entry belonging to another user', async () => {
			const log = await prisma.foodLog.create({
				data: {
					mealLogId: nutrition2Context.mealLog.id,
					foodId: nutrition2Context.food.id,
					quantity: 100,
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-logs/${log.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})
})
