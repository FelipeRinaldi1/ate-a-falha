import { Request, Response } from "express";
import { FoodService } from "../services/food.service.js";
import { createFoodSchema, foodSearchSchema, updateFoodSchema } from "../interfaces/food.schema.js";
import { sendSuccessResponse } from "../../../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";


export class FoodController {
    constructor(private foodService: FoodService) {}

    register = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const userRole = req.user!.role;
        
        const data = createFoodSchema.parse(req.body);
        
        const food = await this.foodService.register(data, userId, userRole);

        return sendSuccessResponse(
            res,
            food,
            'Food Registered Successfully',
            HTTP_STATUS.CREATED
        );
    }

searchFoods = async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const data = foodSearchSchema.parse(req.query); 
    
    const result = await this.foodService.search(data, userId);

    return sendSuccessResponse(res, result, 'Busca realizada', HTTP_STATUS.OK);
}


    getById = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const { id } = req.params;

        const food = await this.foodService.getById(id, userId);

        return sendSuccessResponse(res, food, 'Food details fetched', HTTP_STATUS.OK);
    }

    update = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const userRole = req.user!.role;
        const { id } = req.params; 

        const data = updateFoodSchema.parse(req.body);
        const updatedFood = await this.foodService.update(id, data, userId, userRole);

        return sendSuccessResponse(
            res,
            updatedFood,
            'Food updated Successfully',
            HTTP_STATUS.OK
        );
    }

    delete = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const userRole = req.user!.role;
        const { id } = req.params;

        await this.foodService.remove(id, userId, userRole);

        return sendSuccessResponse(
            res,
            {},
            'Food deleted successfully',
            HTTP_STATUS.OK
        );
    }
}