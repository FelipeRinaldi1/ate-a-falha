import z from 'zod'

export const CreateWorkoutSchema = z.object({
	name: z.string().min(3).max(32).optional(),
	day: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
})

export const UpdateWorkoutSchema = CreateWorkoutSchema.partial()

export const WorkoutSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(3).max(32).nullable(),
	day: z.enum(['A', 'B', 'C', 'D', 'E', 'F']),
	planId: z.string().uuid(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type WorkoutDTO = z.infer<typeof WorkoutSchema>
export type CreateWorkoutDTO = z.infer<typeof CreateWorkoutSchema>
export type UpdateWorkoutDTO = z.infer<typeof UpdateWorkoutSchema>

import { Prisma } from '@/generated/prisma/client.js'

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
