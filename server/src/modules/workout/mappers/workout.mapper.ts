import { Workout } from '@/generated/prisma/client.js'
import { WorkoutEntity } from '../entities/workout.entity.js'

export class WorkoutMapper {
	static toEntity(workout: Workout): WorkoutEntity {
		return {
			id: workout.id,
			name: workout.name,
			day: workout.day,
			PlanId: workout.PlanId,
			createdAt: workout.createdAt,
			updatedAt: workout.updatedAt,
		}
	}
}
