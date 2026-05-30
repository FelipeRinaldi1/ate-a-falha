import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestWorkoutContext, cleanupTestWorkoutContext } from '../helpers/workout.helper.js'
import { getCreateSetMock } from '../mocks/workout.mock.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Exercise Set Integration Tests', () => {
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

	describe('POST /workout/workout-exercises/:workoutExerciseId/sets', () => {
		test('Should add a new set to a workout exercise', async () => {
			const setData = getCreateSetMock({ setNumber: 2, repetitions: 12, weight: 65, restTimeSeconds: 60 })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/workout-exercises/${workout1Context.workoutExercise.id}/sets`)
				.set('Cookie', user1Context.cookie || '')
				.send(setData)

			expect(result.status).toBe(201)
			expect(result.body.workoutExerciseId).toBe(workout1Context.workoutExercise.id)
			expect(result.body.setNumber).toBe(2)
			expect(result.body.repetitions).toBe(12)
			expect(result.body.weight).toBe(65)
			expect(result.body.restTimeSeconds).toBe(60)

			// Clean up in DB
			await prisma.set.delete({ where: { id: result.body.id } })
		})

		test('Should fail if repetitions is negative', async () => {
			const setData = getCreateSetMock({ repetitions: -5 })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/workout-exercises/${workout1Context.workoutExercise.id}/sets`)
				.set('Cookie', user1Context.cookie || '')
				.send(setData)

			expect(result.status).toBe(400)
		})

		test("Should forbid adding a set to another user's workout exercise", async () => {
			const setData = getCreateSetMock()

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/workout-exercises/${workout2Context.workoutExercise.id}/sets`) // User 1 tries to add to User 2's exercise
				.set('Cookie', user1Context.cookie || '')
				.send(setData)

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/workout-exercises/:workoutExerciseId/sets', () => {
		test('Should list sets of a workout exercise', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workout-exercises/${workout1Context.workoutExercise.id}/sets`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(workout1Context.set.id)
		})

		test("Should forbid listing sets of another user's workout exercise", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workout-exercises/${workout2Context.workoutExercise.id}/sets`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/sets/:id', () => {
		test('Should fetch set details by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/sets/${workout1Context.set.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(workout1Context.set.id)
			expect(result.body.setNumber).toBe(workout1Context.set.setNumber)
		})

		test("Should forbid fetching details of another user's set", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/sets/${workout2Context.set.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /workout/sets/:id', () => {
		test('Should update set details', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/sets/${workout1Context.set.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					weight: 85,
					repetitions: 8,
				})

			expect(result.status).toBe(200)
			expect(result.body.weight).toBe(85)
			expect(result.body.repetitions).toBe(8)
		})

		test("Should forbid updating another user's set", async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/sets/${workout2Context.set.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					weight: 100,
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /workout/sets/:id', () => {
		test('Should delete own set', async () => {
			const tempSet = await prisma.set.create({
				data: {
					workoutExerciseId: workout1Context.workoutExercise.id,
					setNumber: 3,
					repetitions: 10,
					weight: 50,
					restTimeSeconds: 60,
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/sets/${tempSet.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify it's gone
			const dbSet = await prisma.set.findUnique({
				where: { id: tempSet.id },
			})
			expect(dbSet).toBeNull()
		})

		test("Should forbid deleting another user's set", async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/sets/${workout2Context.set.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})
})
