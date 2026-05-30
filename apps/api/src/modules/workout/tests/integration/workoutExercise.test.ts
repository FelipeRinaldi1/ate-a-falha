import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestWorkoutContext, cleanupTestWorkoutContext } from '../helpers/workout.helper.js'
import { getCreateWorkoutExerciseMock, getCreateExerciseMock } from '../mocks/workout.mock.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Workout Exercise Integration Tests', () => {
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

	describe('POST /workout/workouts/:workoutId/exercises', () => {
		test('Should link an exercise to a workout template', async () => {
			// Create another exercise in catalog
			const exerciseData = getCreateExerciseMock()
			const exercise = await prisma.exercise.create({ data: exerciseData })

			const linkData = getCreateWorkoutExerciseMock(exercise.id, { orderIndex: 1 })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/workouts/${workout1Context.workout.id}/exercises`)
				.set('Cookie', user1Context.cookie || '')
				.send(linkData)

			expect(result.status).toBe(201)
			expect(result.body.workoutId).toBe(workout1Context.workout.id)
			expect(result.body.exerciseId).toBe(exercise.id)
			expect(result.body.orderIndex).toBe(1)

			// Clean up link and exercise in DB
			await prisma.workoutExercise.delete({ where: { id: result.body.id } })
			await prisma.exercise.delete({ where: { id: exercise.id } })
		})

		test('Should fail if orderIndex is negative', async () => {
			const linkData = getCreateWorkoutExerciseMock(workout1Context.exercise.id, { orderIndex: -1 })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/workouts/${workout1Context.workout.id}/exercises`)
				.set('Cookie', user1Context.cookie || '')
				.send(linkData)

			expect(result.status).toBe(400)
		})

		test("Should forbid adding an exercise to another user's workout template", async () => {
			const linkData = getCreateWorkoutExerciseMock(workout1Context.exercise.id)

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/workouts/${workout2Context.workout.id}/exercises`) // User 1 tries to add to User 2's workout
				.set('Cookie', user1Context.cookie || '')
				.send(linkData)

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/workouts/:workoutId/exercises', () => {
		test('Should list exercises linked to a workout template', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workouts/${workout1Context.workout.id}/exercises`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBe(1)
			expect(result.body[0].id).toBe(workout1Context.workoutExercise.id)
		})

		test("Should forbid listing exercises in another user's workout template", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workouts/${workout2Context.workout.id}/exercises`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/workout-exercises/:id', () => {
		test('Should fetch workout exercise details by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workout-exercises/${workout1Context.workoutExercise.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(workout1Context.workoutExercise.id)
			expect(result.body.workoutId).toBe(workout1Context.workout.id)
		})

		test("Should forbid fetching details of another user's workout-exercise link", async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/workout-exercises/${workout2Context.workoutExercise.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})

	describe('PATCH /workout/workout-exercises/:id', () => {
		test('Should update orderIndex of a linked exercise', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/workout-exercises/${workout1Context.workoutExercise.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					orderIndex: 5,
				})

			expect(result.status).toBe(200)
			expect(result.body.orderIndex).toBe(5)
		})

		test("Should forbid updating another user's workout-exercise link", async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/workout-exercises/${workout2Context.workoutExercise.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send({
					orderIndex: 5,
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /workout/workout-exercises/:id', () => {
		test('Should delete own workout-exercise link and cascade delete sets', async () => {
			// Create a temporary link
			const tempExercise = await prisma.exercise.create({ data: getCreateExerciseMock() })
			const tempLink = await prisma.workoutExercise.create({
				data: {
					workoutId: workout1Context.workout.id,
					exerciseId: tempExercise.id,
					orderIndex: 9,
				},
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/workout-exercises/${tempLink.id}`)
				.set('Cookie', user1Context.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify gone
			const dbLink = await prisma.workoutExercise.findUnique({
				where: { id: tempLink.id },
			})
			expect(dbLink).toBeNull()

			// Clean up exercise
			await prisma.exercise.delete({ where: { id: tempExercise.id } })
		})

		test("Should forbid deleting another user's workout-exercise link", async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/workout-exercises/${workout2Context.workoutExercise.id}`)
				.set('Cookie', user1Context.cookie || '')

			expect(result.status).toBe(403)
		})
	})
})
