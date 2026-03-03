import { prisma } from '../../../infra/client.js';
import { Meal } from '@prisma/client';
import { MealDTO,UpdateMealDTO } from '../interfaces/meal.schema.js';
import { MealExtendedModel } from '../interfaces/meal.interfaces.js';
import { IMealRepository } from '../interfaces/meal.interfaces.js';

export class MealRepository implements IMealRepository {
    async create(data: MealDTO): Promise<Meal> {
        return await prisma.meal.create({
            data
        });
    }

    async findById(id: string): Promise<MealExtendedModel | null> {
        return await prisma.meal.findUnique({
            where: { id },
            include: {
                foods: {
                    include: {
                        food: true
                    }
                },
                diet: true
            }
        }) as MealExtendedModel | null;
    }

    async findAll(): Promise<MealExtendedModel[]> {
        return await prisma.meal.findMany({
            include: {
                foods: {
                    include: {
                        food: true
                    }
                }
            }
        }) as MealExtendedModel[];
    }

    async findAllByDietId(dietId: string): Promise<MealExtendedModel[]> {
        return await prisma.meal.findMany({
            where: { dietId },
            include: {
                foods: {
                    include: {
                        food: true
                    }
                }
            }
        }) as MealExtendedModel[];
    }

    async update(id: string, data: UpdateMealDTO): Promise<Meal> {
        return await prisma.meal.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.meal.delete({
            where: { id }
        });
    }
}