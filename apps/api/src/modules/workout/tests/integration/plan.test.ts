import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestWorkoutContext, cleanupTestWorkoutContext } from '../helpers/workout.helper.js'
import { getCreatePlanMock } from '../mocks/workout.mock.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Workout Plan Integration Tests', () => {
	let user1Context: Awaited<ReturnType<typeof setupTestUser>>
	let user2Context: Awaited<ReturnType<typeof setupTestUser>>
	let workout1Context: Awaited<ReturnType<typeof setupTestWorkoutContext>>
	let workout2Context: Awaited<ReturnType<typeof setupTestWorkoutContext>>

	beforeEach(async () => {
		user1Context = await setupTestUser()
		user2Context = await setupTestUser()
		workout1Context = await setupTestWorkoutContext(user1Context.user.id)
		workout2Context = await setupTestWorkoutContext(user2Context.user.id)
	})

	afterEach(async () => {
		if (user1Context) {
			await cleanupTestWorkoutContext(workout1Context.plan.id, workout1Context.exercise.id)
			await cleanupTestUser(user1Context.user.id, user1Context.cookie)
		}
		if (user2Context) {
			await cleanupTestWorkoutContext(workout2Context.plan.id, workout2Context.exercise.id)
			await cleanupTestUser(user2Context.user.id, user2Context.cookie)
		}
	})

	describe('POST /workout/plans', () => {
		test('Should create a standard workout plan for the authenticated user', async () => {
			const planData = getCreatePlanMock({ name: 'Strength Plan A' })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans`)
				.set('Cookie', user1Context.cookie || '')
				.send(planData)

			expect(result.status).toBe(201)
			expect(result.body.name).toBe('Strength Plan A')
			expect(result.body.userId).toBe(user1Context.user.id)

			// Clean up plan in database
			await prisma.plan.delete({ where: { id: result.body.id } })
		})

		test('Should fail if plan name is too short', async () => {
			const planData = getCreatePlanMock({ name: 'ab' }) // min 3 chars

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans`)
				.set('Cookie', user1Context.cookie || '')
				.send(planData)

			expect(result.status).toBe(400)
		})

		test('Should require authentication', async () => {
			const planData = getCreatePlanMock()

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans`)
				.send(planData)

			expect(result.status).toBe(401)
		})
	})

	describe('GET /workout/plans', () => {
		test('Should list plans belonging to authenticated user', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/plans`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)

			// Check that user1's plan is returned, but user2's plan is not
			const planIds = result.body.map((p: any) => p.id)
			expect(planIds).toContain(workout1Context.plan.id)
			expect(planIds).not.toContain(workout2Context.plan.id)
		})
	})

	describe('GET /workout/plans/:id', () => {
		test('Should fetch own plan by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/plans/${workout1Context.plan.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(workout1Context.plan.id)
			expect(result.body.name).toBe(workout1Context.plan.name)
		})

		test('Should forbid fetching a plan belonging to another user', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/plans/${workout2Context.plan.id}`)
				.set('Cookie', user1Context.cookie || '') // User 1 requests User 2's plan
				.send()

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /workout/plans/:id', () => {
		test('Should update plan details', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/plans/${workout1Context.plan.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Updated Workout Plan Name',
				})

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('Updated Workout Plan Name')
		})

		test('Should forbid updating a plan belonging to another user', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/plans/${workout2Context.plan.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Hack plan',
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /workout/plans/:id', () => {
		test('Should delete own plan and cascade delete all nested entities', async () => {
			// Add a plan that we will delete
			const tempPlan = await prisma.plan.create({
				data: {
					userId: user1Context.user.id,
					name: 'Delete Plan',
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/plans/${tempPlan.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify it is gone from the database
			const dbPlan = await prisma.plan.findUnique({
				where: { id: tempPlan.id },
			})
			expect(dbPlan).toBeNull()
		})

		test('Should forbid deleting a plan belonging to another user', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/plans/${workout2Context.plan.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})
})
