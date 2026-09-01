export { PrismaClient, Prisma } from './generated/prisma/index.js'
export type {
	User,
	Auth,
	BodyMetric,
	Diet,
	Meal,
	FoodInMeal,
	Food,
	Plan,
	Workout,
	WorkoutExercise,
	Set,
	Exercise,
	Notification,
} from './generated/prisma/index.js'
export * from './generated/prisma/index.js'
export { prisma } from './client.js'
export { safeCall } from './safeCall.js'

export * from './types/user.js'
export * from './types/nutrition.js'
export * from './types/workout.js'
export * from './types/notification.js'
