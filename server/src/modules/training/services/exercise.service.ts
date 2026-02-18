import { IExerciseRepository } from "../interfaces/exercise.interfaces.js";
import { createExerciseDTO, exerciseSearchDTO, updateExerciseDTO } from "../interfaces/exercise.schema.js";
import { ExerciseMapper } from "../mapper/exercise.mapper.js";
import { AppError } from "../../../@utils/appError.js"; // Ajuste conforme seu caminho real
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";

export class ExerciseService {
    private exerciseRepository: IExerciseRepository;

    constructor(exerciseRepository: IExerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    async create(data: createExerciseDTO) {
        const newExercise = await this.exerciseRepository.create(data);
        return ExerciseMapper.toHTTP(newExercise);
    }

    async findAll() {
        const exercises = await this.exerciseRepository.findAll();
        return exercises.map(ExerciseMapper.toHTTP);
    }

    async findById(id: string) {
        const exercise = await this.exerciseRepository.findById(id);
        return ExerciseMapper.toHTTP(exercise);
    }

    async findByName(name: string) {
        const exercise = await this.exerciseRepository.findByName(name);
        return ExerciseMapper.toHTTP(exercise);
    }

    async search(searchDTO: exerciseSearchDTO) {
        const searchResults = await this.exerciseRepository.search(searchDTO);
        return searchResults.map(ExerciseMapper.toHTTP);
    }

    async update(id: string, data: updateExerciseDTO) {
        const updatedExercise = await this.exerciseRepository.update(id, data);
        return ExerciseMapper.toHTTP(updatedExercise);
    }

    async delete(id: string) {
        const exerciseExists = await this.exerciseRepository.findById(id);
        await this.exerciseRepository.delete(id);
    }
}