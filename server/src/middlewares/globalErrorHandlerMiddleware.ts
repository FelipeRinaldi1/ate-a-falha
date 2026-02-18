import { Request,Response,NextFunction } from "express";
import { AppError } from "../@utils/appError.js";
import { sendErrorResponse } from "../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../@constants/global/httpCodesConstants.js";
import { ERROR_MESSAGES } from "../@constants/messages/errors.messages.js";
import { LOG_TYPES } from "../@constants/log/log.constants.js";
import { ZodError } from "zod";
import { logger } from "../config/logger.js";
import { Prisma } from "@prisma/client";

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
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        logger.warn({
            type: LOG_TYPES.APP_ERROR,
            code: error.code,
            meta: error.meta
        }, `Prisma Error: ${error.code}`);

        if (error.code === 'P2025') {
            const notFoundError = new AppError(
                "O registro solicitado não foi encontrado ou você não tem permissão para acessá-lo.",
                HTTP_STATUS.NOT_FOUND
            );
            return sendErrorResponse(res, notFoundError);
        }

        if (error.code === 'P2002') {
            const conflictError = new AppError(
                "Já existe um registro com estes dados. Verifique campos duplicados.",
                HTTP_STATUS.CONFLICT
            );
            return sendErrorResponse(res, conflictError);
        }

        const dbError = new AppError(
            "Ocorreu um erro inesperado no banco de dados.",
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
        return sendErrorResponse(res, dbError);
    }

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