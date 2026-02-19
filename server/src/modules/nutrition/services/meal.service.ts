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

    async create(mealId:string,userId:string){
        
    }

}