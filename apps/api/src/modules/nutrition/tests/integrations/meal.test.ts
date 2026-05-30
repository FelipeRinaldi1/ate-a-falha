import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestStandardContext, cleanupTestStandardContext } from '../helpers/nutrition.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Meal Plan Integration Tests', () => {
	let user1Context: Awaited<ReturnType<typeof setupTestUser>>
	let user2Context: Awaited<ReturnType<typeof setupTestUser>>
	let nutrition1Context: Awaited<ReturnType<typeof setupTestStandardContext>>
	let nutrition2Context: Awaited<ReturnType<typeof setupTestStandardContext>>

	beforeEach(async () => {
		user1Context = await setupTestUser()
		user2Context = await setupTestUser()
		nutrition1Context = await setupTestStandardContext(user1Context.user.id)
		nutrition2Context = await setupTestStandardContext(user2Context.user.id)
	})

	afterEach(async () => {
		if (user1Context) {
			await cleanupTestStandardContext(nutrition1Context.diet.id, nutrition1Context.food.id)
			await cleanupTestUser(user1Context.user.id, user1Context.cookie)
		}
		if (user2Context) {
			await cleanupTestStandardContext(nutrition2Context.diet.id, nutrition2Context.food.id)
			await cleanupTestUser(user2Context.user.id, user2Context.cookie)
		}
	})

	describe('POST /nutrition/diets/:dietId/meals', () => {
		test('Should create a standard meal template entry', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets/${nutrition1Context.diet.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Almoço',
					time: '12:30',
					orderIndex: 2,
				})

			expect(result.status).toBe(201)
			expect(result.body.dietId).toBe(nutrition1Context.diet.id)
			expect(result.body.name).toBe('Almoço')
			expect(result.body.time).toBe('12:30')
			expect(result.body.orderIndex).toBe(2)
		})

		test('Should fail if time format is invalid', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets/${nutrition1Context.diet.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Almoço',
					time: '25:00', // Invalid hour
					orderIndex: 2,
				})

			expect(result.status).toBe(400)
		})

		test('Should fail if orderIndex is negative', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets/${nutrition1Context.diet.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Almoço',
					time: '12:00',
					orderIndex: -1,
				})

			expect(result.status).toBe(400)
		})

		test("Should forbid creating standard meal in another user's diet plan", async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets/${nutrition2Context.diet.id}/meals`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to add to User 2's diet
				.send({
					name: 'Almoço',
					time: '12:00',
					orderIndex: 1,
				})

			expect(result.status).toBe(403)
		})
	})

	describe('GET /nutrition/diets/:dietId/meals', () => {
		test('Should list meals in standard diet plan', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets/${nutrition1Context.diet.id}/meals`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(nutrition1Context.meal.id)
			expect(result.body[0].name).toBe('Breakfast')
		})

		test("Should forbid listing meals in another user's diet plan", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets/${nutrition2Context.diet.id}/meals`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to list User 2's meals
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('GET /nutrition/meals/:id', () => {
		test('Should fetch single standard meal template by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(nutrition1Context.meal.id)
			expect(result.body.name).toBe('Breakfast')
		})

		test("Should forbid fetching standard meal belonging to another user's plan", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meals/${nutrition2Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to fetch User 2's meal
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /nutrition/meals/:id', () => {
		test('Should update standard meal details', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Super Breakfast',
					time: '08:30',
				})

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('Super Breakfast')
			expect(result.body.time).toBe('08:30')
		})

		test('Should forbid updating standard meal belonging to another user', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/meals/${nutrition2Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Hacked Meal',
				})

			expect(result.status).toBe(403)
		})

		test('Should fail if update time is invalid', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					time: '24:60',
				})

			expect(result.status).toBe(400)
		})
	})

	describe('DELETE /nutrition/meals/:id', () => {
		test('Should delete standard meal template entry and its food relations due to cascade delete', async () => {
			// Add food to meal first
			const foodInMeal = await prisma.foodInMeal.create({
				data: {
					mealId: nutrition1Context.meal.id,
					foodId: nutrition1Context.food.id,
					quantity: 100,
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify meal is deleted
			const dbMeal = await prisma.meal.findUnique({
				where: { id: nutrition1Context.meal.id },
			})
			expect(dbMeal).toBeNull()

			// Verify linked foodInMeal is cascade deleted
			const dbFoodInMeal = await prisma.foodInMeal.findUnique({
				where: { id: foodInMeal.id },
			})
			expect(dbFoodInMeal).toBeNull()
		})

		test('Should forbid deleting standard meal belonging to another user', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/meals/${nutrition2Context.meal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})
})
