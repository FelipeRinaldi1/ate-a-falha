import z from 'zod'

export const CreateWorkoutExerciseSchema = z.object({
	orderIndex: z.int().nonnegative(),
	exerciseId: z.uuid(),
})
export const UpdateWorkoutExerciseSchema = CreateWorkoutExerciseSchema.partial().omit({ exerciseId: true })

export type CreateWorkoutExerciseDTO = z.infer<typeof CreateWorkoutExerciseSchema>
export type UpdateWorkoutExerciseDTO = z.infer<typeof UpdateWorkoutExerciseSchema>
