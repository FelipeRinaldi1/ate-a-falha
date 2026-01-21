import { Request,Response,NextFunction } from "express";
import { AppError } from "../errors/appError.js";
import { sendErrorResponse } from "../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../@constants/global/httpCodesConstants.js";
import { ERROR_MESSAGES } from "../@constants/global/messagesConstants.js";
import { ZodError } from "zod";

/**
 * Interecepts all errors thrown in the application (async or not)
 * It delegates the response formatting to the centralized 'sendErrorResponse' utility
 * @param error - Error object caught by Express (AppError or generic Error)
 * @param req -Express Request
 * @param res -Express Response
 * @param next - Express Next
 * @returns JSON error response
 */
export const globalErrorHandler = (
    error:Error | AppError,
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    if (error instanceof ZodError){
        const validationError = new AppError(
            ERROR_MESSAGES.VALIDATION.DEFAULT,
            HTTP_STATUS.BAD_REQUEST,
            error.flatten().fieldErrors
        )
        return sendErrorResponse(res,validationError)
    };
    return sendErrorResponse(res,error)
}