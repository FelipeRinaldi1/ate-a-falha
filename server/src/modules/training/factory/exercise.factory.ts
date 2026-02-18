import { ExerciseRepository } from "../repositories/exercise.repository.js";
import { ExerciseService } from "../services/exercise.service.js";
import { ExerciseController } from "../http/exercise.controller.js";

export class ExerciseFactory{
    static createExerciseController(): ExerciseController{
        const exerciseRepository = new ExerciseRepository();
        const exerciseService = new ExerciseService(exerciseRepository);
        return new ExerciseController(exerciseService);
    }
}