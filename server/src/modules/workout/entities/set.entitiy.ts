export interface SetEntity {
	id: string
	setNumber: number
	repetitions: number
	weight?: number | null
	restTimeSeconds: number
	workoutExerciseId: string
	createdAt: Date
	updatedAt: Date
}
