import { z } from 'zod'
import { exerciseSchema } from './exercise.schema.js'
import { setSchema } from './set.schema.js'

export const workoutexerciseSchema = z.object({
	id: z.uuid(),

	workoutId: z.uuid(),

	exerciseId: z.uuid(),
	exercise: exerciseSchema.optional(),

	set: z.array(setSchema).optional(),

	orderIndex: z.number().int().nonnegative(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createWorkoutExerciseSchema = workoutexerciseSchema.pick({
	exerciseId: true,

	orderIndex: true,
})

export const updateWorkoutExerciseSchema = createWorkoutExerciseSchema.partial()

export type WorkoutExerciseDTO = z.infer<typeof workoutexerciseSchema>
export type CreateWorkoutExerciseDTO = z.infer<typeof createWorkoutExerciseSchema>
export type UpdateWorkoutExerciseDTO = z.infer<typeof updateWorkoutExerciseSchema>
