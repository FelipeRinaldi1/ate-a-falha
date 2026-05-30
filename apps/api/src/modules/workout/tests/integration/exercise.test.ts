import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestWorkoutContext, cleanupTestWorkoutContext } from '../helpers/workout.helper.js'
import { getCreateExerciseMock } from '../mocks/workout.mock.js'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import app from '../../../../app.js'
import { prisma } from '@ate-a-falha/database'

describe('Exercise Catalog Integration Tests', () => {
	let userContext: Awaited<ReturnType<typeof setupTestUser>>
	let adminContext: Awaited<ReturnType<typeof setupTestUser>>
	let workoutContext: Awaited<ReturnType<typeof setupTestWorkoutContext>>
	let globalExerciseIdsToCleanup: string[] = []

	beforeEach(async () => {
		userContext = await setupTestUser()
		adminContext = await setupTestUser()
		workoutContext = await setupTestWorkoutContext(userContext.user.id)

		// Promote adminContext user to ADMIN role in database
		await prisma.user.update({
			where: { id: adminContext.user.id },
			data: { role: 'ADMIN' },
		})
	})

	afterEach(async () => {
		for (const id of globalExerciseIdsToCleanup) {
			await prisma.exercise.delete({ where: { id } }).catch(() => {})
		}
		globalExerciseIdsToCleanup = []

		if (userContext) {
			await cleanupTestWorkoutContext(workoutContext.plan.id, workoutContext.exercise.id)
			await cleanupTestUser(userContext.user.id, userContext.cookie)
		}
		if (adminContext) {
			await cleanupTestUser(adminContext.user.id, adminContext.cookie)
		}
	})

	describe('POST /workout/exercise-catalog', () => {
		test('Should create an exercise in the global catalog when performed by an Admin user', async () => {
			const exerciseData = getCreateExerciseMock({ name: 'Admin Dumbbell Fly' })

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/exercise-catalog`)
				.set('Cookie', adminContext.cookie || '')
				.send(exerciseData)

			expect(result.status).toBe(201)
			expect(result.body.name).toBe('Admin Dumbbell Fly')
			expect(result.body.category).toBe(exerciseData.category)

			globalExerciseIdsToCleanup.push(result.body.id)
		})

		test('Should forbid standard user from creating a global exercise', async () => {
			const exerciseData = getCreateExerciseMock()

			const result = await request(app)
				.post(`${BASE_API_URL}/workout/exercise-catalog`)
				.set('Cookie', userContext.cookie || '') // Regular user
				.send(exerciseData)

			expect(result.status).toBe(403)
		})
	})

	describe('GET /workout/exercise-catalog', () => {
		test('Should list exercises from the catalog', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/exercise-catalog`)
				.set('Cookie', userContext.cookie || '')
				.query({ take: 100 })
				.send()

			expect(result.status).toBe(200)
			expect(Array.isArray(result.body)).toBe(true)
			expect(result.body.length).toBeGreaterThanOrEqual(1)

			const exerciseNames = result.body.map((e: any) => e.name)
			expect(exerciseNames).toContain(workoutContext.exercise.name)
		})

		test('Should filter exercises by name', async () => {
			// Create another exercise with unique name
			const adminExercise = await prisma.exercise.create({
				data: getCreateExerciseMock({ name: 'Unique Pullup Exercise' }),
			})
			globalExerciseIdsToCleanup.push(adminExercise.id)

			const result = await request(app)
				.get(`${BASE_API_URL}/workout/exercise-catalog`)
				.set('Cookie', userContext.cookie || '')
				.query({ name: 'pullup' })
				.send()

			expect(result.status).toBe(200)
			expect(result.body.length).toBe(1)
			expect(result.body[0].name).toBe('Unique Pullup Exercise')
		})
	})

	describe('GET /workout/exercise-catalog/:id', () => {
		test('Should fetch single exercise details by ID', async () => {
			const result = await request(app)
				.get(`${BASE_API_URL}/workout/exercise-catalog/${workoutContext.exercise.id}`)
				.set('Cookie', userContext.cookie || '')
				.send()

			expect(result.status).toBe(200)
			expect(result.body.id).toBe(workoutContext.exercise.id)
			expect(result.body.name).toBe(workoutContext.exercise.name)
		})
	})

	describe('PATCH /workout/exercise-catalog/:id', () => {
		test('Should update an exercise in the global catalog when performed by an Admin user', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/exercise-catalog/${workoutContext.exercise.id}`)
				.set('Cookie', adminContext.cookie || '')
				.send({
					name: 'Super Bench Press Pro',
				})

			expect(result.status).toBe(200)
			expect(result.body.name).toBe('Super Bench Press Pro')
		})

		test('Should forbid standard user from updating a global exercise', async () => {
			const result = await request(app)
				.patch(`${BASE_API_URL}/workout/exercise-catalog/${workoutContext.exercise.id}`)
				.set('Cookie', userContext.cookie || '') // Regular user
				.send({
					name: 'Attempted hack',
				})

			expect(result.status).toBe(403)
		})
	})

	describe('DELETE /workout/exercise-catalog/:id', () => {
		test('Should forbid standard user from deleting a global exercise', async () => {
			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/exercise-catalog/${workoutContext.exercise.id}`)
				.set('Cookie', userContext.cookie || '')

			expect(result.status).toBe(403)
		})

		test('Should allow Admin user to delete a global exercise', async () => {
			const tempExercise = await prisma.exercise.create({
				data: getCreateExerciseMock({ name: 'Admin To Delete' }),
			})

			const result = await request(app)
				.delete(`${BASE_API_URL}/workout/exercise-catalog/${tempExercise.id}`)
				.set('Cookie', adminContext.cookie || '')
				.send()

			expect(result.status).toBe(200)

			// Verify it's gone
			const dbExercise = await prisma.exercise.findUnique({
				where: { id: tempExercise.id },
			})
			expect(dbExercise).toBeNull()
		})
	})
})
