import { IFoodInMealRepository } from "../interfaces/food-in-meal.interfaces.js";
import { IMealRepository, MealExtendedModel } from "../interfaces/meal.interfaces.js";
import { FoodInMealDTO, UpdateFoodInMealDTO } from "../interfaces/food-in-meal.schema.js";
import { MealDTO, UpdateMealDTO } from "../interfaces/meal.schema.js";
import { AccessControl } from "../../../@utils/accessControl.js";

export class MealService {
    constructor(
        private mealRepository: IMealRepository, 
        private foodInMealRepository: IFoodInMealRepository,

    ) {}

    private async getValidateMeal(mealId:string,userId:string){
        const meal = await this.mealRepository.findById(mealId,userId);
        
        AccessControl.ensureOwnership(meal?.diet,userId)

        return meal as MealExtendedModel
    }
    async calculateCalories(mealId:string,userId:string){
        const meal = await this.getValidateMeal(mealId,userId)

    }

    async create(data: MealDTO,userId:string){
        const meal = await this.mealRepository.create(data,userId)

        return meal as MealExtendedModel
    }

    async update(mealId:string,userId:string,data:UpdateMealDTO){
        const meal = this.getValidateMeal(mealId,userId)
        
        const updatedMeal = this.mealRepository.update(mealId,userId,data)

        return updatedMeal as MealExtendedModel
    }

    async remove(mealId:string,userId:string){
        const meal = this.getValidateMeal(mealId,userId)
        this.mealRepository.delete(mealId,userId)
    }

}