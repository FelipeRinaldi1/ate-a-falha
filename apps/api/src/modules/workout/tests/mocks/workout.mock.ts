import type { CreatePlanDTO, CreateWorkoutDTO, CreateWorkoutExerciseDTO, CreateSetDTO, CreateExerciseDTO } from '@ate-a-falha/shared'

export const getCreatePlanMock = (overrides?: Partial<CreatePlanDTO>): CreatePlanDTO => {
	return {
		name: 'Standard Hypertrophy Plan',
		...overrides,
	}
}

export const getCreateWorkoutMock = (overrides?: Partial<CreateWorkoutDTO>): CreateWorkoutDTO => {
	return {
		name: 'Push Workout Day',
		day: 'A',
		...overrides,
	}
}

export const getCreateWorkoutExerciseMock = (exerciseId: string, overrides?: Partial<CreateWorkoutExerciseDTO>): CreateWorkoutExerciseDTO & { exerciseId: string } => {
	return {
		exerciseId,
		orderIndex: 0,
		...overrides,
	}
}

export const getCreateSetMock = (overrides?: Partial<CreateSetDTO>): CreateSetDTO => {
	return {
		setNumber: 1,
		repetitions: 10,
		weight: 70,
		restTimeSeconds: 90,
		...overrides,
	}
}

export const getCreateExerciseMock = (overrides?: Partial<CreateExerciseDTO>): CreateExerciseDTO => {
	const rand = Math.floor(Math.random() * 1000000)
	return {
		name: 'Barbell Bench Press',
		externalId: `barbell-bench-press-${rand}`,
		primaryMuscles: ['chest'],
		secondaryMuscles: ['triceps', 'front-deltoids'],
		instructions: ['Lie on a flat bench', 'Unrack the barbell', 'Lower the barbell to your chest', 'Push it back up'],
		category: 'strength',
		images: [],
		...overrides,
	}
}
