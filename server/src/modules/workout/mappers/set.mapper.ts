import { SetEntity } from '../entities/set.entitiy.js'
import { Set } from '@/generated/prisma/client.js'

export class SetMapper {
	static toEntity(set: Set): SetEntity {
		return {
			id: set.id,
			setNumber: set.setNumber,
			repetitions: set.repetitions,
			weight: set.weight,
			restTimeSeconds: set.restTimeSeconds,
			workoutExerciseId: set.workoutExerciseId,
			createdAt: set.createdAt,
			updatedAt: set.updatedAt,
		}
	}
}
