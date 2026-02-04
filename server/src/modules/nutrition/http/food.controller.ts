import { Request, Response } from "express";
import { FoodService } from "../services/food.service.js";
import { createFoodSchema, foodSearchSchema, updateFoodSchema } from "../dtos/food.schema.js";
import { sendSuccessResponse } from "../../../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { AppError } from "../../../@utils/appError.js";

export class FoodController{
    private foodService:FoodService
    constructor(foodService:FoodService){
        this.foodService =  foodService
    }

    create = async (req:Request,res:Response)=>{
        const data = createFoodSchema.parse(req.body)
        const food = await this.foodService.create(data)

        return sendSuccessResponse(
            res,
            food,
            'Food Created Successfully',
            HTTP_STATUS.CREATED
        )
    }

    searchFoods = async (req:Request,res:Response)=>{
        const userId = req.user?.id
        const data = foodSearchSchema.parse(req.body)
        const searchParams = await this.foodService.findAll(data,userId!)

        return sendSuccessResponse(
            res,
            searchParams,
            'Food Search Results',
            HTTP_STATUS.OK
        )
    }

    update = async (req:Request,res:Response)=>{
        const foodId = req.foodId
        if(!foodId){
            throw new AppError("Food ID is Missing",HTTP_STATUS.BAD_REQUEST)
        }
        const data = updateFoodSchema.parse(req.body)
        const updatedFood = await this.foodService.update(foodId,data)

        return sendSuccessResponse(
            res,
            updatedFood,
            'Food updated Succesfully',
            HTTP_STATUS.OK
        )
    }

    delete = async (req:Request,res:Response)=>{
        const foodId = req.body
        await this.foodService.delete(foodId)

        return sendSuccessResponse(
            res,
            {},
            'Food deleted successfully',
            HTTP_STATUS.OK
        )
    }
}