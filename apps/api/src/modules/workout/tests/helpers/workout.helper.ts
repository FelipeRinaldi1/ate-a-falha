import { prisma } from '@ate-a-falha/database'
import { getCreateExerciseMock } from '../mocks/workout.mock.js'

export const setupTestWorkoutContext = async (userId: string) => {
	// 1. Create a global/standard exercise
	const exerciseData = getCreateExerciseMock()
	const exercise = await prisma.exercise.create({
		data: {
			name: exerciseData.name,
			externalId: exerciseData.externalId,
			primaryMuscles: exerciseData.primaryMuscles,
			secondaryMuscles: exerciseData.secondaryMuscles,
			instructions: exerciseData.instructions,
			category: exerciseData.category,
			images: exerciseData.images,
		},
	})

	// 2. Create a standard plan for this user
	const plan = await prisma.plan.create({
		data: {
			userId: userId,
			name: 'Test Workout Plan',
			isActive: true,
		},
	})

	// 3. Create a workout session in the plan
	const workout = await prisma.workout.create({
		data: {
			planId: plan.id,
			name: 'Push Day A',
			day: 'A',
		},
	})

	// 4. Create a workout exercise link
	const workoutExercise = await prisma.workoutExercise.create({
		data: {
			workoutId: workout.id,
			exerciseId: exercise.id,
			orderIndex: 0,
		},
	})

	// 5. Create a set
	const set = await prisma.set.create({
		data: {
			workoutExerciseId: workoutExercise.id,
			setNumber: 1,
			repetitions: 10,
			weight: 60,
			restTimeSeconds: 90,
		},
	})

	return {
		exercise,
		plan,
		workout,
		workoutExercise,
		set,
	}
}

export const cleanupTestWorkoutContext = async (planId: string, exerciseId: string) => {
	// Since ON DELETE CASCADE is configured, deleting the top-level parent entities
	// will automatically cascade delete workouts, workoutExercises, and sets.
	await prisma.plan
		.delete({
			where: { id: planId },
		})
		.catch(() => {})

	await prisma.exercise
		.delete({
			where: { id: exerciseId },
		})
		.catch(() => {})
}
