import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Diet Plan Integration Tests', () => {
	let user1Context: Awaited<ReturnType<typeof setupTestUser>>
	let user2Context: Awaited<ReturnType<typeof setupTestUser>>

	beforeEach(async () => {
		user1Context = await setupTestUser()
		user2Context = await setupTestUser()
	})

	afterEach(async () => {
		if (user1Context) {
			await cleanupTestUser(user1Context.user.id, user1Context.cookie)
		}
		if (user2Context) {
			await cleanupTestUser(user2Context.user.id, user2Context.cookie)
		}
	})

	const setupTestDiet = async (cookie: string, name = 'Default Plan') => {
		const result = await request(app).post(`${BASE_API_URL}/nutrition/diets`).set('Cookie', cookie).send({
			name,
			dailyKcalGoal: 2000,
			dailyProteinGoal: 150,
			dailyCarbGoal: 200,
			dailyFatGoal: 60,
			dailyWaterGoal: 3000,
			dailyWater: 0,
		})
		return result.body
	}

	describe('POST /nutrition/diets', () => {
		test('Should create a standard diet template entry', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Bulking Plan',
					dailyKcalGoal: 3000,
					dailyProteinGoal: 180,
					dailyCarbGoal: 350,
					dailyFatGoal: 80,
					dailyWaterGoal: 4000,
					dailyWater: 500,
				})

			expect(result.status).toBe(201)
			expect(result.body.name).toBe('Bulking Plan')
			expect(result.body.userId).toBe(user1Context.user.id)
			expect(result.body.dailyKcalGoal).toBe(3000)
			expect(result.body.dailyWaterGoal).toBe(4000)
		})

		test('Should fail if name is too short', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'A', // Less than 2 chars
					dailyKcalGoal: 2000,
					dailyProteinGoal: 150,
					dailyCarbGoal: 200,
					dailyFatGoal: 60,
					dailyWaterGoal: 3000,
					dailyWater: 0,
				})

			expect(result.status).toBe(400)
		})

		test('Should fail if calorie goal is negative', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Diet Plan',
					dailyKcalGoal: -100, // Invalid calorie goal
					dailyProteinGoal: 150,
					dailyCarbGoal: 200,
					dailyFatGoal: 60,
					dailyWaterGoal: 3000,
					dailyWater: 0,
				})

			expect(result.status).toBe(400)
		})

		test('Should fail if unauthorized', async () => {
			const result = await request(app).post(`${BASE_API_URL}/nutrition/diets`).send({
				name: 'Diet Plan',
				dailyKcalGoal: 2000,
				dailyProteinGoal: 150,
				dailyCarbGoal: 200,
				dailyFatGoal: 60,
				dailyWaterGoal: 3000,
				dailyWater: 0,
			})

			expect(result.status).toBe(401)
		})
	})

	describe('GET /nutrition/diets', () => {
		test('Should return list of diet templates belonging to user', async () => {
			const diet1 = await setupTestDiet(user1Context.cookie || '', 'Diet 1')
			await setupTestDiet(user2Context.cookie || '', 'Diet 2')

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(diet1.id)
			expect(result.body[0].name).toBe('Diet 1')
		})
	})

	describe('GET /nutrition/diets/:id', () => {
		test('Should fetch a single standard diet template by ID', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'My Main Diet')

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets/${diet.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(diet.id)
			expect(result.body.name).toBe('My Main Diet')
		})

		test('Should forbid fetching standard diet belonging to another user', async () => {
			const diet2 = await setupTestDiet(user2Context.cookie || '', 'User 2 Diet')

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets/${diet2.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to fetch User 2's diet
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /nutrition/diets/:id', () => {
		test('Should update standard diet details', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'My Diet')

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/diets/${diet.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Updated Diet Plan',
					dailyKcalGoal: 2800,
				})

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('Updated Diet Plan')
			expect(result.body.dailyKcalGoal).toBe(2800)
		})

		test('Should forbid updating standard diet belonging to another user', async () => {
			const diet2 = await setupTestDiet(user2Context.cookie || '', 'User 2 Diet')

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/diets/${diet2.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Hacked Diet',
				})

			expect(result.status).toBe(403)
		})

		test('Should fail if update name is too short', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'My Diet')

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/diets/${diet.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'A',
				})

			expect(result.status).toBe(400)
		})
	})

	describe('DELETE /nutrition/diets/:id', () => {
		test('Should delete standard diet template and cascade delete meals and foodInMeals', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'Diet to Delete')

			// Create standard meal under diet
			const meal = await prisma.meal.create({
				data: {
					dietId: diet.id,
					name: 'Lunch',
					time: '13:00',
					orderIndex: 0,
				},
			})

			// Create standard food item
			const food = await prisma.food.create({
				data: {
					name: 'Rice',
					calories: 130,
					carbohydrate: 28,
					protein: 2.7,
					lipids: 0.3,
					fiber: 0.4,
					userId: user1Context.user.id,
				},
			})

			// Create standard foodInMeal under meal
			const foodInMeal = await prisma.foodInMeal.create({
				data: {
					mealId: meal.id,
					foodId: food.id,
					quantity: 150,
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/diets/${diet.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify diet is deleted
			const dbDiet = await prisma.diet.findUnique({
				where: { id: diet.id },
			})
			expect(dbDiet).toBeNull()

			// Verify meal is cascade deleted
			const dbMeal = await prisma.meal.findUnique({
				where: { id: meal.id },
			})
			expect(dbMeal).toBeNull()

			// Verify foodInMeal is cascade deleted
			const dbFoodInMeal = await prisma.foodInMeal.findUnique({
				where: { id: foodInMeal.id },
			})
			expect(dbFoodInMeal).toBeNull()

			// Cleanup food manually
			await prisma.food.delete({ where: { id: food.id } }).catch(() => {})
		})

		test('Should forbid deleting standard diet belonging to another user', async () => {
			const diet2 = await setupTestDiet(user2Context.cookie || '', 'User 2 Diet')

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/diets/${diet2.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('Sharing and Cloning', () => {
		test('Should fail to export diet if isExported is false', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'Private Diet')

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets/${diet.id}/export`)
				.send()

			expect(result.status).toBe(404)
		})

		test('Should export diet if isExported is true (public access)', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'Public Diet')

			await prisma.diet.update({
				where: { id: diet.id },
				data: { isExported: true },
			})

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/diets/${diet.id}/export`)
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(diet.id)
			expect(result.body.isExported).toBe(true)
		})

		test('Should import diet to another user account', async () => {
			const diet = await setupTestDiet(user1Context.cookie || '', 'To Import')

			await prisma.diet.update({
				where: { id: diet.id },
				data: { isExported: true },
			})

			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/diets/${diet.id}/import`)
				.set('Cookie', user2Context.cookie || '')
				.send()

			expect(result.status).toBe(201)
			expect(result.body.name).toBe(`${diet.name} (Importada)`)
			expect(result.body.userId).toBe(user2Context.user.id)

			await prisma.diet.delete({ where: { id: result.body.id } })
		})
	})
})
