import z from 'zod'

export const CreateWorkoutExerciseSchema = z.object({
	orderIndex: z.number().int().nonnegative(),
	exerciseId: z.string().uuid(),
})
export const UpdateWorkoutExerciseSchema = CreateWorkoutExerciseSchema.partial().omit({ exerciseId: true })

export const WorkoutExerciseSchema = z.object({
	id: z.string().uuid(),
	orderIndex: z.number().int().nonnegative(),
	workoutId: z.string().uuid(),
	exerciseId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type WorkoutExerciseDTO = z.infer<typeof WorkoutExerciseSchema>
export type CreateWorkoutExerciseDTO = z.infer<typeof CreateWorkoutExerciseSchema>
export type UpdateWorkoutExerciseDTO = z.infer<typeof UpdateWorkoutExerciseSchema>

import { Prisma } from '@/generated/prisma/client.js'

export type WorkoutExerciseFull = Prisma.WorkoutExerciseGetPayload<{
	include: {
		sets: true
		exercise: true
	}
}>
