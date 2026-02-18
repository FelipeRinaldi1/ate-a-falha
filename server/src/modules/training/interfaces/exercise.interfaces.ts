import { ExerciseModel } from "../model/exercise.model.js";
import { createExerciseDTO,updateExerciseDTO,exerciseSearchDTO } from "./exercise.schema.js";

export interface IExerciseRepository{
    create(exercise: createExerciseDTO): Promise<ExerciseModel>
    search(searchParams: exerciseSearchDTO): Promise<ExerciseModel[]> 
    findById(id: string): Promise<ExerciseModel | null> 
    findByName(name: string): Promise<ExerciseModel | null> 
    findAll():Promise<ExerciseModel[]>
    update(id: string, exercise: updateExerciseDTO): Promise<ExerciseModel | null> 
    delete(id: string): Promise<boolean> 
}

export type ExerciseResponse = {
    id: number;
    name: string;
    description: string;
    muscularGroup: string;
    imageUrl?: string;
}

export interface ExerciseSearchResult {
    items: ExerciseModel[] | ExerciseModel;
    total: number;
    currentPage: number;
    totalPages: number;
}

export interface ExerciseQuery{
    name?: string;
    muscleGroup?: string;
    page: number;
    perPage: number;
}