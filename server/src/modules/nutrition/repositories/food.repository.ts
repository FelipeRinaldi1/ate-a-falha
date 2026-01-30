import {prisma} from '../../../infra/prisma.js'
import { IFoodRepository } from '../dtos/food.interfaces.js'
import { FoodSearchResult } from '../dtos/food.responses.js'
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from '../dtos/food.schema.js'
import { FoodModel } from '../model/food.model.js'

export class FoodRepository implements IFoodRepository{
    async create(data: createFoodDTO): Promise<FoodModel> {
        const newFood  = await prisma.food.create({
            data:{
                ...data,
                fiber:data.fiber ?? 0
            }
        })
        return newFood;
    }

    async findAll(params: foodSearchDTO): Promise<FoodSearchResult> {
        const skip = (params.page-1) * params.perPage;
        const take = (params.perPage);

        const whereCondition = params.name
            ? {name: {contains: params.name, mode:'insensitive' as const}}
            :{};

        const [totalItems,items] = await prisma.$transaction([
            prisma.food.count({where:whereCondition}),
            prisma.food.findMany({
                where: whereCondition,
                skip:skip,
                take:take,
                orderBy: {name:'asc'} 
            })
        ])

        return {
            items: items,
            total: totalItems,
            currentPage: params.page,
            totalPages: Math.ceil(totalItems/params.perPage)
        };
    }

    async findById(id: string): Promise<FoodModel | null> {
        const food = await prisma.food.findFirst({
            where:{
                id: id
            }
        })

        return food
    }

    async findByName(name: string): Promise<FoodModel | null> {
        const food = await prisma.food.findFirst({
            where:{
                name:name
            }
        })
        return food
    }

    async update(id: string, data: updateFoodDTO): Promise<FoodModel | null> {
        const food = await prisma.food.update({
            where:{
                id:id
            },
            data:{
                ...data
            }
        })
        return food
    }
    
    async delete(id: string): Promise<void> {
        await prisma.food.delete({
            where:{
                id:id
            }
        })
    }
}