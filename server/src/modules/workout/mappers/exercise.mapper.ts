import { ExerciseEntity } from '../entities/exercise.entity.js'
import { Exercise } from '@/generated/prisma/client.js'

export class ExerciseMapper {
	static toEntity(exercise: Exercise): ExerciseEntity {
		return {
			id: exercise.id,
			name: exercise.name,
			muscleGroup: exercise.muscleGroup,
			description: exercise.description,
			imageUrl: exercise.imageUrl,
			createdAt: exercise.createdAt,
			updatedAt: exercise.updatedAt,
		}
	}
}
