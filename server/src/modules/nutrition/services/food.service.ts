import { FoodSearchResult, IFoodRepository, FoodResponse } from "../interfaces/food.interfaces.js";
import { createFoodDTO, foodSearchDTO, updateFoodDTO } from "../interfaces/food.schema.js";
import { FoodMapper } from "../mapper/food.mapper.js";
import { AccessControl } from "../../../@utils/accessControl.js";
export class FoodService {
    constructor(private repository: IFoodRepository) {}

    private async getFoodAndValidateAccess(id: string, userId: string) {
        const food = await this.repository.findById(id, userId);
        
        AccessControl.ensureExists(food); 
        
        return food!;
    }

    async register(foodData: createFoodDTO, userId: string, userRole: string): Promise<FoodResponse> {
        const ownerId = userRole === 'admin' ? undefined : userId;
        
        const food = await this.repository.create(foodData, ownerId as string);
        return FoodMapper.toHttp(food);
    }

    async search(searchDTO: foodSearchDTO, userId: string): Promise<FoodSearchResult> {
        return await this.repository.findAll(searchDTO, userId);
    }

    async getById(id: string, userId: string): Promise<FoodResponse> {
        const food = await this.getFoodAndValidateAccess(id, userId);
        return FoodMapper.toHttp(food);
    }

    async update(id: string, foodData: updateFoodDTO, userId: string, userRole: string): Promise<FoodResponse> {
        const food = await this.getFoodAndValidateAccess(id, userId);

        AccessControl.ensureWriteAccess(food, userId, userRole);

        const updatedFood = await this.repository.update(id, userId, foodData);
        return FoodMapper.toHttp(updatedFood);
    }

    async remove(id: string, userId: string, userRole: string): Promise<void> {
        const food = await this.getFoodAndValidateAccess(id, userId);

        AccessControl.ensureWriteAccess(food, userId, userRole);

        await this.repository.delete(id, userId);
    }
}