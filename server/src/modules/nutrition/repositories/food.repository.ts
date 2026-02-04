import { prisma } from '../../../infra/prisma.js'
import { Prisma } from '@prisma/client'
import { IFoodRepository, FoodSearchResult } from '../dtos/food.interfaces.js'
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../dtos/food.schema.js'
import { FoodModel } from '../model/food.model.js'


export class FoodRepository implements IFoodRepository {
    
    async create(data: createFoodDTO, userId?: string): Promise<FoodModel> {
        const newFood = await prisma.food.create({
            data: {
                ...data,
                fiber: data.fiber ?? 0,
                userId: userId
            }
        })
        return newFood;
    }

    async findAll(params: foodSearchDTO, userId: string): Promise<FoodSearchResult> {
        const skip = (params.page - 1) * params.perPage;
        const take = (params.perPage);

        const whereCondition: Prisma.FoodWhereInput = {
            OR: [
                { userId: null },
                { userId: userId }
            ]
        }

        if (params.name) {
            whereCondition.name = {
                contains: params.name,
                mode: 'insensitive'
            }
        }

        const [totalItems, items] = await prisma.$transaction([
            prisma.food.count({ where: whereCondition }),
            prisma.food.findMany({
                where: whereCondition,
                skip: skip,
                take: take,
                orderBy: { name: 'asc' }
            })
        ])

        return {
            items: items,
            total: totalItems,
            currentPage: params.page,
            totalPages: Math.ceil(totalItems / params.perPage)
        };
    }

    async findById(id: string): Promise<FoodModel | null> {
        const food = await prisma.food.findUnique({
            where: { id: id }
        })
        return food
    }

    async findByName(name: string): Promise<FoodModel | null> {
        const food = await prisma.food.findFirst({
            where: { name: name }
        })
        return food
    }

    async update(id: string, data: updateFoodDTO): Promise<FoodModel> {
            return await prisma.food.update({
                where: { id: id },
                data: { ...data }
            })
        }

    async delete(id: string): Promise<void> {
        await prisma.food.delete({
            where: { id: id }
        })
    }
}