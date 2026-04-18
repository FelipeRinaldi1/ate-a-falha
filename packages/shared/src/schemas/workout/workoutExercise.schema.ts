import { z } from 'zod'

export const CreateWorkoutexerciseSchema = z.object({
	orderIndex: z.number().int().nonnegative(),
	exerciseId: z.uuid(),
})
export const UpdateWorkoutexerciseSchema = CreateWorkoutexerciseSchema.partial().omit({ exerciseId: true })

export const WorkoutexerciseSchema = z.object({
	id: z.uuid(),
	orderIndex: z.number().int().nonnegative(),
	workoutId: z.uuid(),
	exerciseId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type WorkoutExerciseDTO = z.infer<typeof WorkoutexerciseSchema>
export type CreateWorkoutExerciseDTO = z.infer<typeof CreateWorkoutexerciseSchema>
export type UpdateWorkoutExerciseDTO = z.infer<typeof UpdateWorkoutexerciseSchema>
