import {prisma} from "../../../infra/client.js";
import { Diet } from "@prisma/client";
import { DietExtendedModel, IDietRepository } from "../interfaces/diet.interfaces.js";
import { CreateDietDTO,UpdateDietDTO } from "../interfaces/diet.schema.js";

export class DietRepository implements IDietRepository{
    async create(diet: CreateDietDTO): Promise<Diet> {
        const newDiet = await prisma.diet.create({
            data:diet
        }) 
        return newDiet;
    }
    async findAll(userId: string): Promise<DietExtendedModel[]> {
        return await prisma.diet.findMany({
            where: {
                userId: userId
            },
            include: {
                Meal: {
                    include: {
                        foods: {
                            include: {
                                food: true
                            }
                        }
                    }
                }
            }
        });
    }
    async findById(id: string): Promise<DietExtendedModel | null> {
        return await prisma.diet.findUnique({
            where: { id },
            include: {
                Meal: {
                    include: {
                        foods: {
                            include: {
                                food: true
                            }
                        }
                    }
                }
            }
        });
    }
    async update(id: string, diet: UpdateDietDTO): Promise<Diet> {
        return await prisma.diet.update({
            where: { id },
            data:diet
        })
    }
    async delete(id: string): Promise<void> {
        await prisma.diet.delete({
            where: { id }
        })
    }
}