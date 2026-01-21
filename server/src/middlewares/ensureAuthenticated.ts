import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import {tokenPayLoadSchema} from "../modules/auth/auth.schema.js"
import { AppError } from "../errors/appError.js";
import { ENV } from "../@constants/env.js";
import { HTTP_STATUS } from "../@constants/global/httpCodesConstants.js";
import { ERROR_MESSAGES } from "../@constants/global/messagesConstants.js";

/**
 * Global Authentication Middleware
 * *Intercepts incoming requests to validate the JWT token found in the 'Authorization' header.
 * If the token is valid, it extracts the user ID and attatches it to the 'req' object.
 * (as `req.userId`) for use in downstream controllers
 * @param req -The Express Request object (Mutated to include `userId`)
 * @param res - The Express response object used to return authentication errors.
 * @param next - The function to proceed to the next middleware or controller.
 * @returns - Returns a 401 (Unauthorized) response if the token is missing,invalid or expired. 
 * Otherwise, it calls `next()`to continue the request flow.
 */
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