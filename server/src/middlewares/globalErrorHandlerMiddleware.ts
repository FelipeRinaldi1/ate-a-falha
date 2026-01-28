import { Request,Response,NextFunction } from "express";
import { AppError } from "../@utils/appError.js";
import { sendErrorResponse } from "../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../@constants/global/httpCodesConstants.js";
import { ERROR_MESSAGES } from "../@constants/messages/errors.messages.js";
import { LOG_TYPES } from "../@constants/log/log.constants.js";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export const globalErrorHandler = (
    error:Error | AppError,
    req:Request,
    res:Response,
    next:NextFunction
) =>{
    if (error instanceof ZodError){
        logger.warn({
            type: LOG_TYPES.VALIDATION_ERROR,
            issues:error.issues
        },ERROR_MESSAGES.VALIDATION.DEFAULT)

        const validationError = new AppError(
            ERROR_MESSAGES.VALIDATION.DEFAULT,
            HTTP_STATUS.BAD_REQUEST,      
            error.flatten().fieldErrors
        )
        return sendErrorResponse(res,validationError)
    };

    if(error instanceof AppError){
        logger.warn({
            type: LOG_TYPES.APP_ERROR,
            statusCode: error.statusCode
        },`${LOG_TYPES.APP_ERROR}: ${error.message}`)
        return sendErrorResponse(res,error)
    }
    logger.error(error,LOG_TYPES.CRITICAL)
    return sendErrorResponse(res,error)
}