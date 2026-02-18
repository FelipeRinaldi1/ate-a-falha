import { randomUUID } from "crypto";
import { createExerciseDTO, updateExerciseDTO,exerciseSearchDTO} from "../interfaces/exercise.schema.js";
import { ExerciseModel } from "../model/exercise.model.js";
import { IExerciseRepository } from "../interfaces/exercise.interfaces.js";
import { AppError } from "../../../@utils/appError.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";

export class InMemoryExerciseRepository implements IExerciseRepository {
    private exercises: ExerciseModel[] = []

    async create(exercise: createExerciseDTO): Promise<ExerciseModel>{
        const newExercise: ExerciseModel = {
            id: randomUUID(),
            name: exercise.name,
            description: exercise.description,
            muscleGroup: exercise.muscleGroup,
            imageUrl: exercise.imageUrl || null,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.exercises.push(newExercise);
        return newExercise;
    }

    async update(id: string, exercise: updateExerciseDTO): Promise<ExerciseModel> {
        const index = this.exercises.findIndex(ex => ex.id === id);
        if (index === -1) {
            throw new AppError('Exercise not found', HTTP_STATUS.NOT_FOUND);
    }

        const updatedExercise = {
            ...this.exercises[index],
            ...exercise,
            updatedAt: new Date()
        }

        this.exercises[index] = updatedExercise;
        return updatedExercise;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.exercises.findIndex(ex => ex.id === id);
        if (index === -1) {
            throw new AppError('Exercise not found', HTTP_STATUS.NOT_FOUND);
    }

        this.exercises.splice(index, 1);
        return true;
    }

    async search(searchParams: exerciseSearchDTO): Promise<ExerciseModel[]> {
        const {name,muscleGroup} = searchParams;

        return this.exercises.filter(ex => {
                const nameTerm = name?.trim().toLowerCase();
                const groupTerm = muscleGroup?.trim().toLowerCase();

                const matchesName = !nameTerm || ex.name.toLowerCase().includes(nameTerm);
                const matchesGroup = !groupTerm || ex.muscleGroup.toLowerCase() === groupTerm;

                return matchesName && matchesGroup;
            });
    }

    async findById(id: string): Promise<ExerciseModel | null> {
        const exercise = this.exercises.find(ex => ex.id === id);
        return exercise || null;
    }

    async findByName(name: string): Promise<ExerciseModel | null> {
        const exercise = this.exercises.find(ex => ex.name === name);
        return exercise || null;
    }

    async findAll(): Promise<ExerciseModel[]> {
        return this.exercises;
    }
}