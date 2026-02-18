
export class ExerciseMapper {
    static toHTTP(exercise: any) {
        return {
            id: exercise.id,
            name: exercise.name,
            muscleGroup: exercise.muscleGroup,
            description: exercise.description,
            createdAt: exercise.createdAt,
            updatedAt: exercise.updatedAt
        }
    }
}