import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestFood } from '../helpers/food.helper.js'
import { overrideFoodMock, updateFoodMock, createFoodMock } from '../mocks/food.mock.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Food Catalog Integration Tests', () => {
	let user1Context: Awaited<ReturnType<typeof setupTestUser>>
	let user2Context: Awaited<ReturnType<typeof setupTestUser>>
	let adminContext: Awaited<ReturnType<typeof setupTestUser>>
	let globalFoodIdsToCleanup: string[] = []

	beforeEach(async () => {
		user1Context = await setupTestUser()
		user2Context = await setupTestUser()
		adminContext = await setupTestUser()

		// Manually promote adminContext user to ADMIN role in database
		await prisma.user.update({
			where: { id: adminContext.user.id },
			data: { role: 'ADMIN' },
		})
	})

	afterEach(async () => {
		// Cleanup global foods first to prevent foreign key or leftover records issues
		for (const id of globalFoodIdsToCleanup) {
			await prisma.food.delete({ where: { id } }).catch(() => {})
		}
		globalFoodIdsToCleanup = []

		if (user1Context) {
			await cleanupTestUser(user1Context.user.id, user1Context.cookie)
		}
		if (user2Context) {
			await cleanupTestUser(user2Context.user.id, user2Context.cookie)
		}
		if (adminContext) {
			await cleanupTestUser(adminContext.user.id, adminContext.cookie)
		}
	})

	describe('POST /nutrition/food-catalog', () => {
		test('Should create a custom food item for a normal user', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/food-catalog`)
				.set('Cookie', user1Context.cookie || '')
				.send(createFoodMock)

			expect(result.status).toBe(201)
			expect(result.body.name).toBe(createFoodMock.name)
			expect(result.body.userId).toBe(user1Context.user.id)
			expect(result.body.calories).toBe(createFoodMock.calories)
		})

		test('Should create a global food item when performed by an Admin user', async () => {
			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/food-catalog`)
				.set('Cookie', adminContext.cookie || '')
				.send(overrideFoodMock({ name: '0_Global Apple' }))

			expect(result.status).toBe(201)
			expect(result.body.name).toBe('0_Global Apple')
			expect(result.body.userId).toBeNull() // Global food has null userId

			globalFoodIdsToCleanup.push(result.body.id)
		})

		test('Should fail if not authenticated', async () => {
			const result = await request(app).post(`${BASE_API_URL}/nutrition/food-catalog`).send(createFoodMock)

			expect(result.status).toBe(401)
		})

		test('Should fail to create food with invalid data (wrong type)', async () => {
			const invalidFood = {
				...createFoodMock,
				calories: 'invalid-number',
			}

			const result = await request(app)
				.post(`${BASE_API_URL}/nutrition/food-catalog`)
				.set('Cookie', user1Context.cookie || '')
				.send(invalidFood)

			expect(result.status).toBe(400)
		})
	})

	describe('GET /nutrition/food-catalog', () => {
		test('Should list accessible foods (own custom foods + global foods)', async () => {
			// 1. Create a global food using Admin. Use '0_' prefix to ensure it sorts to the top alphabetically.
			const adminFood = await setupTestFood(adminContext.cookie || '', { name: '0_Shared Apple' })
			globalFoodIdsToCleanup.push(adminFood.id)

			// 2. Create custom food for User 1
			await setupTestFood(user1Context.cookie || '', { name: '0_User 1 Pear' })

			// 3. Create custom food for User 2
			await setupTestFood(user2Context.cookie || '', { name: '0_User 2 Grape' })

			// 4. Request list as User 1
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)

			const foodNames = result.body.map((f: any) => f.name)
			expect(foodNames).toContain('0_Shared Apple')
			expect(foodNames).toContain('0_User 1 Pear')
			expect(foodNames).not.toContain('0_User 2 Grape') // User 2's food must be private
		})

		test('Should fail to list foods if unauthenticated', async () => {
			const result = await request(app).get(`${BASE_API_URL}/nutrition/food-catalog`).send()

			expect(result.status).toBe(401)
		})

		test('Should filter food list by name (case-insensitive)', async () => {
			await setupTestFood(user1Context.cookie || '', { name: 'Special Rice' })
			await setupTestFood(user1Context.cookie || '', { name: 'Brown Bean' })

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog`)
				.set('Cookie', user1Context.cookie || '')
				.query({ name: 'rice' })
				.send()

			expect(result.status).toBe(200)
			expect(result.body.length).toBeGreaterThanOrEqual(1)
			const hasRice = result.body.every((f: any) => f.name.toLowerCase().includes('rice'))
			expect(hasRice).toBe(true)
		})

		test('Should support take pagination limit', async () => {
			await setupTestFood(user1Context.cookie || '', { name: 'A Food' })
			await setupTestFood(user1Context.cookie || '', { name: 'B Food' })

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog`)
				.set('Cookie', user1Context.cookie || '')
				.query({ take: 1 })
				.send()

			expect(result.status).toBe(200)
			expect(result.body.length).toBe(1)
		})
	})

	describe('GET /nutrition/food-catalog/:id', () => {
		test('Should fetch a single food item by ID for its owner', async () => {
			const food = await setupTestFood(user1Context.cookie || '', { name: 'My Own Banana' })

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog/${food.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(food.id)
			expect(result.body.name).toBe('My Own Banana')
		})

		test('Should fetch a global food item for any user', async () => {
			const globalFood = await setupTestFood(adminContext.cookie || '', { name: 'Global Banana' })
			globalFoodIdsToCleanup.push(globalFood.id)

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog/${globalFood.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(globalFood.id)
			expect(result.body.userId).toBeNull()
		})

		test('Should forbid fetching a food item belonging to another user', async () => {
			const user2Food = await setupTestFood(user2Context.cookie || '', { name: 'User 2 Avocado' })

			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog/${user2Food.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to access User 2's food
				.send()

			expect(result.status).toBe(403)
		})

		test('Should return 400 Bad Request for an invalid food ID format', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/nutrition/food-catalog/invalid-uuid`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(400)
		})
	})

	describe('PATCH /nutrition/food-catalog/:id', () => {
		test('Should update custom food details by its owner', async () => {
			const food = await setupTestFood(user1Context.cookie || '', { name: 'Original Rice' })

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-catalog/${food.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send(updateFoodMock)

			expect(result.status).toBe(200)
			expect(result.body.name).toBe(updateFoodMock.name)
			expect(result.body.calories).toBe(updateFoodMock.calories)
		})

		test('Should forbid updating a food item belonging to another user', async () => {
			const user2Food = await setupTestFood(user2Context.cookie || '', { name: 'Original Rice' })

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-catalog/${user2Food.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 tries to update
				.send(updateFoodMock)

			expect(result.status).toBe(403)
		})

		test('Should forbid updating a global food item when performed by a normal user (returns 404)', async () => {
			const globalFood = await setupTestFood(adminContext.cookie || '', { name: 'Global Milk' })
			globalFoodIdsToCleanup.push(globalFood.id)

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-catalog/${globalFood.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send(updateFoodMock)

			expect(result.status).toBe(404) // Filtered out by userId in repository where clause
		})

		test('Should allow updating a global food item when performed by an Admin user', async () => {
			const globalFood = await setupTestFood(adminContext.cookie || '', { name: 'Global Water' })
			globalFoodIdsToCleanup.push(globalFood.id)

			const result = await request(app)
				.patch(`${BASE_API_URL}/nutrition/food-catalog/${globalFood.id}`)
				.set('Cookie', adminContext.cookie || '')
				.send({ name: 'Global Mineral Water' })

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('Global Mineral Water')
			expect(result.body.userId).toBeNull()
		})
	})

	describe('DELETE /nutrition/food-catalog/:id', () => {
		test('Should delete a custom food item by its owner', async () => {
			const food = await setupTestFood(user1Context.cookie || '', { name: 'Temporary Food' })

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-catalog/${food.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Double check it's deleted from database
			const dbFood = await prisma.food.findUnique({ where: { id: food.id } })
			expect(dbFood).toBeNull()
		})

		test('Should forbid deleting a food item belonging to another user', async () => {
			const user2Food = await setupTestFood(user2Context.cookie || '', { name: 'User 2 Snack' })

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-catalog/${user2Food.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(403)
		})

		test('Should forbid deleting a global food item when performed by a normal user (returns 404)', async () => {
			const globalFood = await setupTestFood(adminContext.cookie || '', { name: 'Global Bread' })
			globalFoodIdsToCleanup.push(globalFood.id)

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-catalog/${globalFood.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(404) // Filtered out by userId in repository where clause
		})

		test('Should allow Admin to delete a global food item', async () => {
			const globalFood = await setupTestFood(adminContext.cookie || '', { name: 'Global Cheese' })
			// No need to cleanup in afterEach if successfully deleted here
			globalFoodIdsToCleanup = globalFoodIdsToCleanup.filter((id) => id !== globalFood.id)

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-catalog/${globalFood.id}`)
				.set('Cookie', adminContext.cookie || '')
				.send()

			expect(result.status).toBe(200)

			const dbFood = await prisma.food.findUnique({ where: { id: globalFood.id } })
			expect(dbFood).toBeNull()
		})

		test("Should allow Admin to delete a normal user's food item", async () => {
			const userFood = await setupTestFood(user1Context.cookie || '', { name: 'User private food' })

			const result = await request(app)
				.delete(`${BASE_API_URL}/nutrition/food-catalog/${userFood.id}`)
				.set('Cookie', adminContext.cookie || '')
				.send()

			expect(result.status).toBe(200)

			const dbFood = await prisma.food.findUnique({ where: { id: userFood.id } })
			expect(dbFood).toBeNull()
		})
	})
})
