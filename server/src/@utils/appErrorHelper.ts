import { Response } from "express";
import { AppError } from "./appError.js";

export const sendSuccessResponse = (res: Response, data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

export const sendErrorResponse = (res: Response, error: Error | AppError) => {
    let statusCode = 500;
    const message = error.message;
    let data = {};

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        data = error.data;
    }

    if(statusCode ===500){
        console.log(error);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
}