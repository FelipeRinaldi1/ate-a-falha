import { FoodModel } from "../model/food.model.js";
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from "./food.schema.js";
import { FoodSearchResult } from "./food.responses.js";

export interface IFoodRepository{
    create(data:createFoodDTO):Promise < FoodModel>;
    findAll(params:foodSearchDTO):Promise<FoodSearchResult>;
    findById(id:string):Promise<FoodModel|null>;
    findByName(name:string):Promise<FoodModel|null>;
    update(id:string, data:updateFoodDTO):Promise<FoodModel|null>;
    delete(id:string):Promise<void>;
}