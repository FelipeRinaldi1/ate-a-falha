import { Prisma } from '../generated/prisma/client.js'

export type ExerciseFull = Prisma.ExerciseGetPayload<{
	include: { usedInWorkouts: true }
}>

export type PlanFull = Prisma.PlanGetPayload<{
	include: {
		workouts: {
			include: {
				workoutExercises: {
					include: {
						sets: true
						exercise: true
					}
				}
			}
		}
	}
}>

export type SetFull = Prisma.SetGetPayload<{}>

export type WorkoutFull = Prisma.WorkoutGetPayload<{
	include: {
		workoutExercises: {
			include: {
				sets: true
				exercise: true
			}
		}
	}
}>

export type WorkoutExerciseFull = Prisma.WorkoutExerciseGetPayload<{
	include: {
		sets: true
		exercise: true
	}
}>
