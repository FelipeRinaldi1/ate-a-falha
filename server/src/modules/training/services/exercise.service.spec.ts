import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExerciseService } from './exercise.service.js';
import { InMemoryExerciseRepository } from '../repositories/in-memory-exercise.repository.js'; // Assumindo que você criou este
import { ExerciseMapper } from "../mapper/exercise.mapper.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { logger } from '../../../config/logger.js';

// Mock do Mapper para isolar o teste do Service
vi.mock("../mapper/exercise.mapper.js", () => ({
    ExerciseMapper: {
        toHTTP: vi.fn((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            description: exercise.description,
            muscleGroup: exercise.muscleGroup,
            videoUrl: exercise.videoUrl ?? null,
            createdAt: exercise.createdAt
        }))
    }
}));

describe('Exercise Service Unit Tests', () => {
    let exerciseRepository: InMemoryExerciseRepository;
    let exerciseService: ExerciseService;

    // Helper para criar dados válidos de teste
    const createValidExerciseData = (overrides = {}) => ({
        name: 'Supino Reto',
        description: 'Exercício para peitoral com barra',
        muscleGroup: 'Peito',
        videoUrl: 'https://youtube.com/watch?v=123',
        ...overrides
    });

    beforeEach(() => {
        exerciseRepository = new InMemoryExerciseRepository();
        exerciseService = new ExerciseService(exerciseRepository);
        vi.clearAllMocks();
    });

    describe('Create', () => {
        it('should create an exercise and return it mapped', async () => {
            logger.info('Test: Starting successful exercise creation');
            const exerciseData = createValidExerciseData();

            const result = await exerciseService.create(exerciseData);

            expect(result).toHaveProperty('id');
            expect(result.name).toBe(exerciseData.name);
            expect(ExerciseMapper.toHTTP).toHaveBeenCalled();
            
            // Verifica se foi salvo no "banco" em memória
            const savedInDb = await exerciseRepository.findById(result.id);
            expect(savedInDb).not.toBeNull();
            logger.info({ exerciseId: result.id }, 'Test: Exercise creation completed');
        });
    });

    describe('FindAll', () => {
        it('should return all exercises mapped', async () => {
            logger.info('Test: Listing all exercises');
            await exerciseRepository.create(createValidExerciseData({ name: 'Agachamento' }));
            await exerciseRepository.create(createValidExerciseData({ name: 'Leg Press' }));

            const result = await exerciseService.findAll();

            expect(result).toHaveLength(2);
            expect(ExerciseMapper.toHTTP).toHaveBeenCalledTimes(2);
        });
    });

    describe('FindById', () => {
        it('should find an exercise by id successfully', async () => {
            const created = await exerciseRepository.create(createValidExerciseData());
            logger.info({ id: created.id }, 'Test: Finding exercise by ID');

            const result = await exerciseService.findById(created.id);

            expect(result.id).toBe(created.id);
            expect(result.name).toBe(created.name);
        });

        it('should throw AppError if exercise is not found by ID', async () => {
            logger.info('Test: Attempting to find non-existent exercise ID');
            
            // Nota: Certifique-se que seu Service ou Repo lança erro se não achar nada
            await expect(
                exerciseService.findById('invalid-id')
            ).rejects.toEqual(expect.objectContaining({
                statusCode: HTTP_STATUS.NOT_FOUND
            }));
        });
    });

    describe('Search', () => {
        it('should return filtered exercises based on search params', async () => {
            logger.info('Test: Searching exercises with filters');
            await exerciseRepository.create(createValidExerciseData({ name: 'Puxada Frente', muscleGroup: 'Costas' }));
            
            const searchParams = { name: 'Puxada' };
            const result = await exerciseService.search(searchParams);

            expect(result).toHaveLength(1);
            expect(result[0].name).toContain('Puxada');
        });
    });

    describe('Update', () => {
        it('should update exercise and return updated data mapped', async () => {
            const created = await exerciseRepository.create(createValidExerciseData({ name: 'Rosca Direta' }));
            const updateData = { name: 'Rosca Direta com Halteres' };

            const result = await exerciseService.update(created.id, updateData);

            expect(result.name).toBe('Rosca Direta com Halteres');
            logger.info('Test: Exercise update validated');
        });
    });

    describe('Delete', () => {
        it('should delete an exercise successfully', async () => {
            const created = await exerciseRepository.create(createValidExerciseData());
            
            await exerciseService.delete(created.id);

            const search = await exerciseRepository.findById(created.id);
            expect(search).toBeNull();
            logger.info('Test: Delete confirmed');
        });
    });
});