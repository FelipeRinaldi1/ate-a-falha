import {Request,Response} from "express";
import { ExerciseService } from "../services/exercise.service.js";
import { sendSuccessResponse } from "../../../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { exerciseSearchSchema } from "../interfaces/exercise.schema.js";
import { ExerciseQuery } from "../interfaces/exercise.interfaces.js";

export class ExerciseController{
    constructor(private exerciseService: ExerciseService){
        this.exerciseService = exerciseService;
    }

    create = async (req:Request,res:Response)=>{
        const exerciseData = req.body;
        const createdExercise = await this.exerciseService.create(exerciseData);
        return sendSuccessResponse(
            res,
            createdExercise,
            'Exercise created successfully',
            HTTP_STATUS.CREATED
        )
    }

    getAll = async (req:Request,res:Response)=>{
        const exercises = await this.exerciseService.findAll();
        return sendSuccessResponse(
            res,
            exercises,
            'Exercises retrieved successfully',
            HTTP_STATUS.OK
        )
    }
    
    getByName = async (req:Request,res:Response)=>{
        const name = req.query.name as string;
        const exercises = await this.exerciseService.findByName(name);
        return sendSuccessResponse(
            res,
            exercises,
            'Exercises retrieved successfully',
            HTTP_STATUS.OK
        )
    }

    getById = async (req:Request,res:Response)=>{
        const exerciseId = req.params.id;
        const exercise = await this.exerciseService.findById(exerciseId);
        return sendSuccessResponse(
            res,
            exercise,
            'Exercise retrieved successfully',
            HTTP_STATUS.OK
        )
    }

    search = async (req:Request,res:Response)=>{
        const query = exerciseSearchSchema.parse(req.query) as ExerciseQuery;
        const searchResults = await this.exerciseService.search(query);
        return sendSuccessResponse(
            res,
            searchResults,
            'Exercises retrieved successfully',
            HTTP_STATUS.OK
        )
    }

    update = async (req:Request,res:Response)=>{
        const exerciseId = req.params.id;
        const exerciseData = req.body;
        const updatedExercise = await this.exerciseService.update(exerciseId,exerciseData);
        return sendSuccessResponse(
            res,
            updatedExercise,
            'Exercise updated successfully',
            HTTP_STATUS.OK
        )
    }

    delete = async (req:Request,res:Response)=>{
        const exerciseId = req.params.id;
        await this.exerciseService.delete(exerciseId);
        return sendSuccessResponse(
            res,
            {},
            'Exercise deleted successfully',
            HTTP_STATUS.OK
        )
    }
}