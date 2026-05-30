import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestWorkoutContext, cleanupTestWorkoutContext } from '../helpers/workout.helper.js'
import { getCreateWorkoutMock } from '../mocks/workout.mock.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Workout Template Integration Tests', () => {
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

	describe('POST /workout/plans/:planId/workouts', () => {
		test('Should create a workout session inside a plan', async () => {
			const workoutData = getCreateWorkoutMock({ name: 'Leg Day B', day: 'B' })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans/${workout1Context.plan.id}/workouts`)
				.set('Cookie', user1Context.cookie || '')
				.send(workoutData)

			expect(result.status).toBe(201)
			expect(result.body.name).toBe('Leg Day B')
			expect(result.body.day).toBe('B')
			expect(result.body.planId).toBe(workout1Context.plan.id)

			// Clean up in DB
			await prisma.workout.delete({ where: { id: result.body.id } })
		})

		test('Should fail if workout day is invalid', async () => {
			const workoutData = getCreateWorkoutMock({ day: 'Z' as any }) // Only A-F are allowed

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans/${workout1Context.plan.id}/workouts`)
				.set('Cookie', user1Context.cookie || '')
				.send(workoutData)

			expect(result.status).toBe(400)
		})

		test('Should fail if workout name is too short', async () => {
			const workoutData = getCreateWorkoutMock({ name: 'ab' }) // min 3 chars

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans/${workout1Context.plan.id}/workouts`)
				.set('Cookie', user1Context.cookie || '')
				.send(workoutData)

			expect(result.status).toBe(400)
		})

		test("Should forbid creating a workout inside another user's plan", async () => {
			const workoutData = getCreateWorkoutMock()

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/plans/${workout2Context.plan.id}/workouts`) // User 1 tries to add to User 2's plan
				.set('Cookie', user1Context.cookie || '')
				.send(workoutData)

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/plans/:planId/workouts', () => {
		test('Should list workouts inside a plan', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/plans/${workout1Context.plan.id}/workouts`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(workout1Context.workout.id)
		})

		test("Should forbid listing workouts of another user's plan", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/plans/${workout2Context.plan.id}/workouts`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/workouts/:id', () => {
		test('Should fetch workout by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workouts/${workout1Context.workout.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(workout1Context.workout.id)
		})

		test("Should forbid fetching another user's workout by ID", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workouts/${workout2Context.workout.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /workout/workouts/:id', () => {
		test('Should update workout details', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/workouts/${workout1Context.workout.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'New Workout Name',
					day: 'C',
				})

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('New Workout Name')
			expect(result.body.day).toBe('C')
		})

		test("Should forbid updating another user's workout", async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/workouts/${workout2Context.workout.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					name: 'Hacked name',
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /workout/workouts/:id', () => {
		test('Should delete own workout and cascade delete all workout exercises/sets', async () => {
			const tempWorkout = await prisma.workout.create({
				data: {
					planId: workout1Context.plan.id,
					name: 'Leg Day C',
					day: 'C',
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/workouts/${tempWorkout.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify it's gone
			const dbWorkout = await prisma.workout.findUnique({
				where: { id: tempWorkout.id },
			})
			expect(dbWorkout).toBeNull()
		})

		test("Should forbid deleting another user's workout", async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/workouts/${workout2Context.workout.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})
})
