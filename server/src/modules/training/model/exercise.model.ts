export interface ExerciseModel {
    id: string;
    name: string;
    description: string | null;
    muscleGroup: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
}