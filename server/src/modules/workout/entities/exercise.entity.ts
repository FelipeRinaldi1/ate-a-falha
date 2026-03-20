export interface ExerciseEntity {
	id: string
	name: string
	muscleGroup: string
	description?: string | null
	imageUrl?: string | null
	createdAt: Date
	updatedAt: Date
}
