import { describe, expect, it } from 'vitest'
import {
	passwordSchema,
	loginSchema,
	changePasswordSchema,
	changeEmailSchema,
} from './user/auth.schema.js'
import { createUserWithAuthSchema, updateUserSchema } from './user/user.schema.js'
import { createBodyMetricSchema, bodyMetricSearchSchema } from './user/bodyMetric.schema.js'
import { createDietSchema, updateDietSchema } from './nutrition/diet.schema.js'
import { createDietLogSchema } from './nutrition/dietLog.schema.js'
import { createMealSchema } from './nutrition/meal.schema.js'
import { createMealLogSchema, updateMealLogSchema } from './nutrition/mealLog.schema.js'
import { createFoodInMealSchema } from './nutrition/foodInMeal.schema.js'
import { createFoodLogSchema } from './nutrition/foodLog.schema.js'
import { createFoodSchema, foodSearchSchema } from './nutrition/food.schema.js'
import { createPlanSchema, updatePlanSchema } from './workout/plan.schema.js'
import { createWorkoutSchema, updateWorkoutSchema } from './workout/workout.schema.js'
import { createWorkoutExerciseSchema } from './workout/workoutExercise.schema.js'
import { createSetSchema, replaceSetsSchema } from './workout/set.schema.js'
import { createExerciseSchema, searchExerciseSchema } from './workout/exercise.schema.js'
import {
	createNotificationSchema,
	notificationSearchSchema,
	updateNotificationSchema,
} from './notification/notification.schema.js'

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'

describe('Shared Zod Schemas', () => {
	describe('User & Auth schemas', () => {
		it('enforces strong password rules while keeping login permissive', () => {
			expect(passwordSchema.safeParse('StrongP@ss1').success).toBe(true)
			expect(passwordSchema.safeParse('weak').success).toBe(false)
			expect(passwordSchema.safeParse('nouppercase1!').success).toBe(false)
			expect(passwordSchema.safeParse('NOLOWERCASE1!').success).toBe(false)
			expect(passwordSchema.safeParse('NoNumber!').success).toBe(false)
			expect(passwordSchema.safeParse('NoSymbol123').success).toBe(false)

			expect(loginSchema.safeParse({ email: 'user@example.com', password: 'legacyPassword' }).success).toBe(true)
			expect(loginSchema.safeParse({ email: 'bad-email', password: '' }).success).toBe(false)
		})

		it('rejects changePassword when newPassword equals oldPassword', () => {
			const same = changePasswordSchema.safeParse({
				oldPassword: 'StrongP@ss1',
				newPassword: 'StrongP@ss1',
			})
			expect(same.success).toBe(false)

			const valid = changePasswordSchema.safeParse({
				oldPassword: 'StrongP@ss1',
				newPassword: 'StrongP@ss2',
			})
			expect(valid.success).toBe(true)
		})

		it('validates changeEmailSchema, createUserWithAuthSchema and updateUserSchema', () => {
			expect(changeEmailSchema.safeParse({ newEmail: 'new@example.com', password: 'secret' }).success).toBe(true)
			expect(changeEmailSchema.safeParse({ newEmail: 'invalid', password: 'secret' }).success).toBe(false)

			const userRes = createUserWithAuthSchema.safeParse({
				name: 'Ana',
				birthDate: '2000-01-01',
				gender: 'OTHER',
				auth: { email: 'ana@example.com', password: 'StrongP@ss1' },
			})
			expect(userRes.success).toBe(true)

			const withRole = createUserWithAuthSchema.safeParse({
				name: 'Ana',
				birthDate: '2000-01-01',
				gender: 'FEMALE',
				role: 'ADMIN',
				auth: { email: 'ana@example.com', password: 'StrongP@ss1' },
			})
			expect(withRole.success).toBe(true)
			if (withRole.success) {
				expect('role' in withRole.data).toBe(false)
			}

			expect(updateUserSchema.safeParse({ name: 'Ana Maria', gender: 'FEMALE' }).success).toBe(true)
			expect(updateUserSchema.safeParse({ name: '' }).success).toBe(false)
		})

		it('validates bodyMetric boundaries and query coercion', () => {
			expect(
				createBodyMetricSchema.safeParse({
					weight: 75.5,
					height: 178,
					activityLevel: 2,
					bodyFat: null,
					muscleRate: 40,
				}).success
			).toBe(true)
			expect(
				createBodyMetricSchema.safeParse({ weight: 0, height: 178, activityLevel: 2 }).success
			).toBe(false)
			expect(
				createBodyMetricSchema.safeParse({ weight: 75, height: 178, activityLevel: 5 }).success
			).toBe(false)
			expect(
				createBodyMetricSchema.safeParse({ weight: 75, height: 178, activityLevel: 2, bodyFat: 60 }).success
			).toBe(false)

			const searchRes = bodyMetricSearchSchema.safeParse({ take: '15' })
			expect(searchRes.success).toBe(true)
			if (searchRes.success) expect(searchRes.data.take).toBe(15)
		})
	})

	describe('Nutrition schemas', () => {
		it('validates diet goals, integers, and name lengths', () => {
			expect(
				createDietSchema.safeParse({
					name: 'Hipertrofia',
					dailyKcalGoal: 2800,
					dailyProteinGoal: 180,
					dailyCarbGoal: 320,
					dailyFatGoal: 70,
					dailyFiberGoal: 30,
					dailyWaterGoal: 3000,
					dailyWater: 500,
				}).success
			).toBe(true)

			expect(
				createDietSchema.safeParse({
					name: 'A',
					dailyKcalGoal: 2800,
					dailyProteinGoal: 180,
					dailyCarbGoal: 320,
					dailyFatGoal: 70,
					dailyWaterGoal: 3000,
					dailyWater: 0,
				}).success
			).toBe(false)

			expect(updateDietSchema.safeParse({ name: 'x'.repeat(65) }).success).toBe(false)
		})

		it('validates dietLog, meal, mealLog (including optional foods), foodInMeal, and foodLog', () => {
			expect(createDietLogSchema.safeParse({ date: '2026-05-01', waterIntake: 1000 }).success).toBe(true)
			expect(createDietLogSchema.safeParse({ date: '2026-05-01', waterIntake: -1 }).success).toBe(false)

			expect(createMealSchema.safeParse({ name: 'Almoço', time: '12:30', orderIndex: 0 }).success).toBe(true)
			expect(createMealSchema.safeParse({ name: 'Almoço', time: '25:00', orderIndex: 0 }).success).toBe(false)

			expect(
				createMealLogSchema.safeParse({
					name: 'Jantar',
					time: '20:00',
					orderIndex: 1,
					foods: [{ foodId: VALID_UUID, quantity: 150 }],
				}).success
			).toBe(true)
			expect(updateMealLogSchema.safeParse({ name: 'Ceia' }).success).toBe(true)

			expect(createFoodInMealSchema.safeParse({ foodId: VALID_UUID, quantity: 100 }).success).toBe(true)
			expect(createFoodInMealSchema.safeParse({ foodId: VALID_UUID, quantity: 0 }).success).toBe(false)
			expect(createFoodLogSchema.safeParse({ foodId: VALID_UUID, quantity: 50 }).success).toBe(true)
			expect(createFoodLogSchema.safeParse({ foodId: 'not-uuid', quantity: 50 }).success).toBe(false)
		})

		it('validates food creation, trimming, and search coercion', () => {
			const parsed = createFoodSchema.safeParse({
				name: '  Arroz Branco  ',
				protein: 2.5,
				carbohydrate: 28,
				lipids: 0.3,
				fiber: 1.6,
			})
			expect(parsed.success).toBe(true)
			if (parsed.success) expect(parsed.data.name).toBe('Arroz Branco')

			expect(
				createFoodSchema.safeParse({
					name: '   ',
					protein: 1,
					carbohydrate: 1,
					lipids: 1,
					fiber: 1,
				}).success
			).toBe(false)

			const search = foodSearchSchema.safeParse({ take: '20', onlyMine: 'true' })
			expect(search.success).toBe(true)
			if (search.success) {
				expect(search.data.take).toBe(20)
				expect(search.data.onlyMine).toBe(true)
			}
		})
	})

	describe('Workout schemas', () => {
		it('validates plan, workout, workoutExercise, set, replaceSets, and exercise', () => {
			expect(createPlanSchema.safeParse({ name: 'Treino ABC' }).success).toBe(true)
			expect(createPlanSchema.safeParse({ name: 'AB' }).success).toBe(false)
			expect(createPlanSchema.safeParse({ name: 'x'.repeat(51) }).success).toBe(false)
			expect(updatePlanSchema.safeParse({ isActive: true, goal: 'forca' }).success).toBe(true)

			expect(createWorkoutSchema.safeParse({ name: 'Peito e Tríceps', day: 'A', weekDay: 'SEG' }).success).toBe(
				true
			)
			expect(createWorkoutSchema.safeParse({ name: 'AB', day: 'A' }).success).toBe(false)
			expect(updateWorkoutSchema.safeParse({ day: 'Z' }).success).toBe(false)

			expect(createWorkoutExerciseSchema.safeParse({ exerciseId: VALID_UUID, orderIndex: 0 }).success).toBe(true)
			expect(createWorkoutExerciseSchema.safeParse({ exerciseId: VALID_UUID, orderIndex: -1 }).success).toBe(
				false
			)

			expect(createSetSchema.safeParse({ repetitions: 12, restTimeSeconds: 60, weight: null }).success).toBe(true)
			expect(createSetSchema.safeParse({ repetitions: 0, restTimeSeconds: 60 }).success).toBe(false)
			expect(
				replaceSetsSchema.safeParse({
					sets: [
						{ repetitions: 10, restTimeSeconds: 60, weight: 40 },
						{ repetitions: 8, restTimeSeconds: 90 },
					],
				}).success
			).toBe(true)

			expect(
				createExerciseSchema.safeParse({
					name: 'Supino Reto',
					externalId: 'bench_press',
					primaryMuscles: ['peito'],
					secondaryMuscles: ['triceps'],
					instructions: ['Deite no banco'],
					category: 'forca',
					images: [],
				}).success
			).toBe(true)

			const exSearch = searchExerciseSchema.safeParse({ random: 'true', take: '100' })
			expect(exSearch.success).toBe(true)
			if (exSearch.success) {
				expect(exSearch.data.random).toBe(true)
				expect(exSearch.data.take).toBe(100)
			}
		})
	})

	describe('Notification schemas', () => {
		it('validates create, update, and search notification schemas', () => {
			expect(
				createNotificationSchema.safeParse({
					title: 'Treino',
					message: 'Hora de treinar',
					type: 'WORKOUT',
					userId: VALID_UUID,
				}).success
			).toBe(true)
			expect(createNotificationSchema.safeParse({ title: '', message: 'msg' }).success).toBe(false)
			expect(updateNotificationSchema.safeParse({ read: true }).success).toBe(true)

			const search = notificationSearchSchema.safeParse({ unreadOnly: 'true', take: '50' })
			expect(search.success).toBe(true)
			if (search.success) {
				expect(search.data.unreadOnly).toBe(true)
				expect(search.data.take).toBe(50)
			}
		})
	})
})
