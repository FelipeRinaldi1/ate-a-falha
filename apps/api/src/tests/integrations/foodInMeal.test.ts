import { setupTestUser, cleanupTestUser } from '../helpers/auth.helper.js'
import { setupTestStandardContext, cleanupTestStandardContext } from '../helpers/nutrition.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('FoodInMeal Integration Tests', () => {
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

	const setupTestFoodInMeal = async (cookie: string, mealId: string, foodId: string, quantity = 100) => {
		const result = await request(app)
			.post(`${BASE_API_URL}/nutrition/meals/${mealId}/foods`)
			.set('Cookie', cookie)
			.send({ foodId, quantity })
		return result.body
	}

	describe('POST /nutrition/meals/:mealId/foods', () => {
		test('Should add a food item to standard meal template', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					foodId: nutrition1Context.food.id,
					quantity: 150,
				})

			expect(result.status).toBe(201)
			expect(result.body.mealId).toBe(nutrition1Context.meal.id)
			expect(result.body.foodId).toBe(nutrition1Context.food.id)
			expect(result.body.quantity).toBe(150)
		})

		test('Should fail if quantity is not positive', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					foodId: nutrition1Context.food.id,
					quantity: -50,
				})

			expect(result.status).toBe(400)
		})

		test('Should fail if adding food to another user\'s meal template', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meals/${nutrition2Context.meal.id}/foods`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to add to User 2's meal
				.send({
					foodId: nutrition1Context.food.id,
					quantity: 100,
				})

			expect(result.status).toBe(403)
		})

		test('Should fail if adding another user\'s private food item to own meal template', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					foodId: nutrition2Context.food.id, // User 2's private food
					quantity: 100,
				})

			expect(result.status).toBe(403)
		})
	})

	describe('GET /nutrition/meals/:mealId/foods', () => {
		test('Should list foods in standard meal template', async () => {
			const foodInMeal = await setupTestFoodInMeal(
				user1Context.cookie || '',
				nutrition1Context.meal.id,
				nutrition1Context.food.id,
				120
			)

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meals/${nutrition1Context.meal.id}/foods`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(foodInMeal.id)
			expect(result.body[0].quantity).toBe(120)
		})

		test('Should forbid listing foods in another user\'s meal template', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/meals/${nutrition2Context.meal.id}/foods`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to list User 2's meal foods
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('GET /nutrition/food-in-meals/:id', () => {
		test('Should fetch single food-in-meal entry by ID', async () => {
			const foodInMeal = await setupTestFoodInMeal(
				user1Context.cookie || '',
				nutrition1Context.meal.id,
				nutrition1Context.food.id,
				80
			)

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(foodInMeal.id)
			expect(result.body.quantity).toBe(80)
		})

		test('Should forbid fetching a food-in-meal entry belonging to another user', async () => {
			const foodInMeal2 = await setupTestFoodInMeal(
				user2Context.cookie || '',
				nutrition2Context.meal.id,
				nutrition2Context.food.id,
				80
			)

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal2.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to fetch User 2's entry
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /nutrition/food-in-meals/:id', () => {
		test('Should update food-in-meal quantity in standard template', async () => {
			const foodInMeal = await setupTestFoodInMeal(
				user1Context.cookie || '',
				nutrition1Context.meal.id,
				nutrition1Context.food.id,
				100
			)

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					quantity: 250,
				})

			expect(result.status).toBe(200)
			expect(result.body.quantity).toBe(250)
		})

		test('Should forbid updating food-in-meal belonging to another user', async () => {
			const foodInMeal2 = await setupTestFoodInMeal(
				user2Context.cookie || '',
				nutrition2Context.meal.id,
				nutrition2Context.food.id,
				100
			)

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal2.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					quantity: 250,
				})

			expect(result.status).toBe(403)
		})

		test('Should fail if update quantity is negative', async () => {
			const foodInMeal = await setupTestFoodInMeal(
				user1Context.cookie || '',
				nutrition1Context.meal.id,
				nutrition1Context.food.id,
				100
			)

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					quantity: -10,
				})

			expect(result.status).toBe(400)
		})
	})

	describe('DELETE /nutrition/food-in-meals/:id', () => {
		test('Should delete a food-in-meal template entry', async () => {
			const foodInMeal = await setupTestFoodInMeal(
				user1Context.cookie || '',
				nutrition1Context.meal.id,
				nutrition1Context.food.id,
				100
			)

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify it's deleted in the DB
			const dbFoodInMeal = await prisma.foodInMeal.findUnique({
				where: { id: foodInMeal.id },
			})
			expect(dbFoodInMeal).toBeNull()
		})

		test('Should forbid deleting a food-in-meal entry belonging to another user', async () => {
			const foodInMeal2 = await setupTestFoodInMeal(
				user2Context.cookie || '',
				nutrition2Context.meal.id,
				nutrition2Context.food.id,
				100
			)

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-in-meals/${foodInMeal2.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})
})
