import { prisma } from '../../../infra/prisma.js'
import { Prisma, Food } from '@prisma/client'
import { IFoodRepository, FoodSearchResult } from '../interfaces/food.interfaces.js'
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../interfaces/food.schema.js'

export class FoodRepository implements IFoodRepository {
    
    async create(data: createFoodDTO,userId:string): Promise<Food> {
        return await prisma.food.create({
            data: {
                ...data,
                userId: userId
            }
        });
    }

    async findAll(params: foodSearchDTO, userId?: string): Promise<FoodSearchResult> {
        const skip = (params.page - 1) * params.perPage;

        const whereCondition: Prisma.FoodWhereInput = {
            AND: [
                {
                    OR: [
                        { userId: null },
                        ...(userId ? [{ userId }] : [])
                    ]
                },
                params.name ? {
                    name: { contains: params.name, mode: 'insensitive' }
                } : {}
            ]
        };

        const [totalItems, items] = await prisma.$transaction([
            prisma.food.count({ where: whereCondition }),
            prisma.food.findMany({
                where: whereCondition,
                skip,
                take: params.perPage,
                orderBy: { name: 'asc' }
            })
        ]);

        return {
            items,
            total: totalItems,
            currentPage: params.page,
            totalPages: Math.ceil(totalItems / params.perPage)
        };
    }

    async findById(id: string,userId?:string): Promise<Food | null> {
        return await prisma.food.findFirst({
            where:{
                id,
                OR:[
                    {userId:null},
                    {userId:userId || undefined}
                ]
            }
        });
    }

    async update(id: string,userId:string, data: updateFoodDTO): Promise<Food> {
        return await prisma.food.update({
            where: { 
                id,
                userId:userId
            },
            data:data
        });
    }

    async delete(id: string,userId:string): Promise<void> {
        await prisma.food.delete({
            where: { id,
                userId:userId
             }
        });
    }
}