import { IFoodRepository } from "../dtos/food.interfaces.js";

class FoodService{
    private repository:IFoodRepository
    constructor(repository: IFoodRepository){
        this.repository = repository
    }

    
}