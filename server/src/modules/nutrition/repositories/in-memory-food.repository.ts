import { FoodModel } from "../model/food.model.js";
import { IFoodRepository } from "../dtos/food.interfaces.js";
import { FoodSearchResult } from "../dtos/food.responses.js";
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from "../dtos/food.schema.js";
import { randomUUID } from "crypto";
import { logger } from "../../../config/logger.js";
import { AppError } from "../../../@utils/appError.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";

export class InMemoryFoodRepository implements IFoodRepository {
    public foods: FoodModel[] = []

    async create(data: createFoodDTO): Promise<FoodModel> {
        logger.info({ data: data }, 'InMemoryRepo: Starting a Food creation')

        const newFood: FoodModel = {
            id: randomUUID(),
            name: data.name,
            baseUnit: data.baseUnit,
            baseAmount: data.baseAmount,
            calories: data.calories,
            carbohydrate: data.carbohydrate,
            protein: data.protein,
            fat: data.fat,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        this.foods.push(newFood);
        
        logger.info({ id: newFood.id }, 'InMemoryRepo: Food created successfully')
        return newFood
    }

    async findAll(params: foodSearchDTO): Promise<FoodSearchResult> {
        logger.info({ params }, 'InMemoryRepo: Searching foods')

        let find = this.foods;

        if (params.name) {
            find = find.filter((item) => {
                return item.name.toLowerCase().includes(params.name!.toLowerCase())
            })
        }

        find.sort((a,b)=> a.name.localeCompare(b.name))

        const totalItems = find.length
        
        const start = (params.page - 1) * params.perPage;
        const end = start + params.perPage;

        const paginatedFoods = find.slice(start, end);

        logger.info({ totalFound: totalItems, page: params.page }, 'InMemoryRepo: Search completed')

        return {
            items: paginatedFoods,
            total: totalItems,
            currentPage: params.page,
            totalPages: Math.ceil(totalItems / params.perPage)
        }
    }

    async findById(id: string): Promise<FoodModel | null> {
        logger.info({ id }, 'InMemoryRepo: Finding food by ID')

        const food = this.foods.find((food) => food.id === id)
        
        if (!food) {
            logger.warn({ id }, 'InMemoryRepo: Food not found by ID')
            return null
        }

        return food
    }

    async findByName(name: string): Promise<FoodModel | null> {
        logger.info({ name }, 'InMemoryRepo: Finding food by Name')

        const food = this.foods.find((food) => food.name === name)
        
        if (!food) {
            logger.info({ name }, 'InMemoryRepo: Food not found by Name')
            return null
        }

        return food
    }

    async update(id: string, data: updateFoodDTO): Promise<FoodModel | null> {
        logger.info({ id, data }, 'InMemoryRepo: Attempting to update food')

        const index = this.foods.findIndex((food) => food.id === id)
        
        if (index === -1) {
            logger.warn({ id }, 'InMemoryRepo: Update failed - Food not found')
            return null
        }

        const updatedFood = {
            ...this.foods[index],
            ...data,
            updatedAt: new Date()
        }

        this.foods[index] = updatedFood
        
        logger.info({ id }, 'InMemoryRepo: Food updated successfully')
        return updatedFood
    }

    async delete(id: string): Promise<void> {
        logger.info({ id }, 'InMemoryRepo: Attempting to delete food')

        const index = this.foods.findIndex((food) => food.id === id)
        
        if (index === -1) {
            logger.warn({ id }, 'InMemoryRepo: Delete failed - Food not found')
            throw new AppError('Food not found', HTTP_STATUS.NOT_FOUND)
        }

        this.foods.splice(index, 1)
        
        logger.info({ id }, 'InMemoryRepo: Food deleted successfully')
    }
}