import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { AppError } from "../../../@utils/appError.js";
import { FoodSearchResult, IFoodRepository } from "../dtos/food.interfaces.js";
import { FoodResponse } from "../dtos/food.interfaces.js";
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from "../dtos/food.schema.js";
import { FoodMapper } from "../mapper/food.mapper.js";

export class FoodService{
    private repository:IFoodRepository
    constructor(repository: IFoodRepository){
        this.repository = repository
    }

    async create(foodData:createFoodDTO):Promise <FoodResponse>{
        const food = await this.repository.create(foodData)
        const foodMapped = FoodMapper.toHttp(food)
        return foodMapped
    }

    async findAll(searchDTO:foodSearchDTO,userId:string):Promise <FoodSearchResult>{
        const searchResult = await this.repository.findAll(searchDTO,userId)
        return searchResult
    }

    async findById(id:string):Promise<FoodResponse>{
        const food = await this.repository.findById(id)
        if (food===null){
            throw new AppError('Food not found',HTTP_STATUS.NOT_FOUND)
        }
        
        const foodMapped = FoodMapper.toHttp(food)

        return foodMapped
    }

    async findByName(name:string):Promise<FoodResponse>{
        const food = await this.repository.findByName(name)
        if (food===null){
            throw new AppError('Food not found',HTTP_STATUS.NOT_FOUND)
        }
        
        const foodMapped = FoodMapper.toHttp(food)

        return foodMapped
    }

    async update(id:string,foodData:updateFoodDTO):Promise <FoodResponse>{
        const updatedFood = await this.repository.update(id,foodData)
        const mappedFood = FoodMapper.toHttp(updatedFood)
        return mappedFood
    }

    async delete(id:string):Promise <void>{
        const deleted = await this.repository.delete(id)

    }
    
}