import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import { tokenPayLoadSchema } from "../modules/auth/dtos/auth.schema.js";
import { AppError } from "../@utils/appError.js";
import { ENV } from "../config/env.js";
import { HTTP_STATUS } from "../@constants/global/httpCodesConstants.js";
import { ERROR_MESSAGES } from "../@constants/messages/errors.messages.js";

export function ensureAuthenticated(
    req:Request,
    res:Response,
    next:NextFunction
){
    const {authorization}= req.headers;

    //1. Checks Header
    if(!authorization){
        throw new AppError(
            ERROR_MESSAGES.AUTH.MISSING_TOKEN,
            HTTP_STATUS.UNAUTHORIZED
        )
    }

    //2. Removes "Bearer <token>"
    const [,token] = authorization.split(" ");

    if (!token){
        throw new AppError(
            ERROR_MESSAGES.AUTH.MISSING_TOKEN,
            HTTP_STATUS.UNAUTHORIZED
        )
    }

    try{
        //3. Verify and decode
        const decoded = jwt.verify(token,ENV.JWT_SECRET)

        //4. Validate with zod payload
        const payload = tokenPayLoadSchema.parse(decoded);


        //5. Inject into request
        req.user={
            id: payload.id,
            email: payload.email,
        };

        return next();
    }catch(error){
        throw new AppError(
            ERROR_MESSAGES.AUTH.INVALID_TOKEN,
            HTTP_STATUS.UNAUTHORIZED
        )
    }
}