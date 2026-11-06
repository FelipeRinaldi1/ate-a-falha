import { describe, test, beforeEach, afterEach, expect } from 'vitest'
import request from 'supertest'
import app from '../../../../app.js'
import { BASE_API_URL } from '@/constants/global/baseURL.js'
import { setupTestUser, cleanupTestUser } from '../../../../tests/auth.helper.js'
import { setupTestWorkoutContext, cleanupTestWorkoutContext } from '../../../workout/tests/helpers/workout.helper.js'
import {
	setupTestStandardContext,
	cleanupTestStandardContext,
} from '../../../nutrition/tests/helpers/nutrition.helper.js'
import { prisma } from '@ate-a-falha/database'
import { ShareLogic } from '@ate-a-falha/shared'

describe('Share Lookup Module Integration Tests', () => {
	let userContext: Awaited<ReturnType<typeof setupTestUser>>

	beforeEach(async () => {
		userContext = await setupTestUser()
	})

	afterEach(async () => {
		if (userContext) {
			await cleanupTestUser(userContext.user.id, userContext.cookie)
		}
	})

	test('Should resolve an exported workout plan by its T-XXXXXX short code', async () => {
		const workoutContext = await setupTestWorkoutContext(userContext.user.id)
		await prisma.plan.update({
			where: { id: workoutContext.plan.id },
			data: { isExported: true },
		})

		const shortCode = ShareLogic.generateShareCode('workout', workoutContext.plan.id)

		const res = await request(app).get(`${BASE_API_URL}/share/lookup/${shortCode}`)

		expect(res.status).toBe(200)
		expect(res.body).toEqual({
			resourceType: 'workout',
			resourceId: workoutContext.plan.id,
			name: workoutContext.plan.name,
			shareCode: shortCode,
		})

		await cleanupTestWorkoutContext(workoutContext.plan.id, workoutContext.exercise.id)
	})

	test('Should resolve an exported diet by its D-XXXXXX short code', async () => {
		const nutritionContext = await setupTestStandardContext(userContext.user.id)
		await prisma.diet.update({
			where: { id: nutritionContext.diet.id },
			data: { isExported: true },
		})

		const shortCode = ShareLogic.generateShareCode('diet', nutritionContext.diet.id)

		const res = await request(app).get(`${BASE_API_URL}/share/lookup/${shortCode}`)

		expect(res.status).toBe(200)
		expect(res.body).toEqual({
			resourceType: 'diet',
			resourceId: nutritionContext.diet.id,
			name: nutritionContext.diet.name,
			shareCode: shortCode,
		})

		await cleanupTestStandardContext(nutritionContext.diet.id, nutritionContext.food.id)
	})

	test('Should return 404 when workout plan is not exported (isExported = false)', async () => {
		const workoutContext = await setupTestWorkoutContext(userContext.user.id)
		const shortCode = ShareLogic.generateShareCode('workout', workoutContext.plan.id)

		const res = await request(app).get(`${BASE_API_URL}/share/lookup/${shortCode}`)

		expect(res.status).toBe(404)

		await cleanupTestWorkoutContext(workoutContext.plan.id, workoutContext.exercise.id)
	})

	test('Should return 404 when code does not match any exported resource', async () => {
		const res = await request(app).get(`${BASE_API_URL}/share/lookup/T-FFFFFF`)

		expect(res.status).toBe(404)
	})

	test('Should return 400 when code format is invalid', async () => {
		const res = await request(app).get(`${BASE_API_URL}/share/lookup/INVALID_123`)

		expect(res.status).toBe(400)
	})
})
