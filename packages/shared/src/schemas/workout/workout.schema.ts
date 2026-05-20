import { z } from 'zod'
import { workoutexerciseSchema } from './workoutExercise.schema.js'

export const workoutSchema = z.object({
	id: z.uuid(),
	planId: z.uuid(),
	name: z.string().min(3).max(32).nullable(),
	day: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),

	exercises: z.array(workoutexerciseSchema).optional(),

	createdAt: z.date(),
	updatedAt: z.date(),
})

export const createWorkoutSchema = workoutSchema.pick({
	name: true,
	day: true,
})

export const updateWorkoutSchema = createWorkoutSchema.partial()

export type WorkoutDTO = z.infer<typeof workoutSchema>
export type CreateWorkoutDTO = z.infer<typeof createWorkoutSchema>
export type UpdateWorkoutDTO = z.infer<typeof updateWorkoutSchema>
