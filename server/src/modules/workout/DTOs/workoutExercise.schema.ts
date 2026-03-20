import z from 'zod'
import { CreateWorkoutSchema } from './workout.schema.js'

export const CreateWorkoutExerciseSchema = z.object({
	orderIndex: z.int(),
	workoutId: z.uuid(),
	exerciseId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})
export const UpdateWorkoutSchema = CreateWorkoutExerciseSchema.partial()

export type CreateWorkoutSchemaDTO = z.infer<typeof CreateWorkoutSchema>
export type UpdateWorkoutSchemaDTO = z.infer<typeof UpdateWorkoutSchema>
