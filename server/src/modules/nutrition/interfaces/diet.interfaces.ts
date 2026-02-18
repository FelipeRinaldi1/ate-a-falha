import { Prisma, Diet } from "@prisma/client";
import { CreateDietDTO, UpdateDietDTO } from "./diet.schema.js";

export const dietInclude = Prisma.validator<Prisma.DietDefaultArgs>()({
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

export type DietExtendedModel = Prisma.DietGetPayload<typeof dietInclude>;
export interface IDietRepository {
    create(diet: CreateDietDTO): Promise<Diet>;
    findAll(userId: string): Promise<DietExtendedModel[]>;
    findById(id: string): Promise<DietExtendedModel | null>;
    update(id: string, diet: UpdateDietDTO): Promise<Diet>;
    delete(id: string): Promise<void>;
}
