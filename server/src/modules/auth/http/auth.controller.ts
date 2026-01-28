import { Request,Response } from "express";
import { AuthService } from "../services/auth.service.js";

import { sendSuccessResponse } from "../../../@utils/appErrorHelper.js";
import { registerSchema,
    loginSchema,
    changePasswordSchema,
    changeEmailSchema 
} from "../dtos/auth.schema.js"

import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { SUCCESS_MESSAGES } from "../../../@constants/messages/sucess.messages.js";
import { AppError } from "../../../@utils/appError.js";
import { ERROR_MESSAGES } from "../../../@constants/messages/errors.messages.js";

export class AuthController{
    private authService:AuthService
    constructor(authService:AuthService){
        this.authService = authService
    }


    register = async (req:Request,res:Response)=>{
        const data = registerSchema.parse(req.body)
        const user = await this.authService.registerUser(data)
        
        return sendSuccessResponse(
            res,
            user,
            SUCCESS_MESSAGES.AUTH.REGISTER,
            HTTP_STATUS.CREATED
        )
    }

    login = async (req:Request,res:Response)=>{
        const data = loginSchema.parse(req.body)
        const user = await this.authService.loginUser(data)

        return sendSuccessResponse(
            res,
            user,
            SUCCESS_MESSAGES.AUTH.LOGIN,
            HTTP_STATUS.OK
        )
    }

    changePassword = async (req:Request,res:Response)=>{
        const userId = req.user?.id
        if(!userId){
            throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }
        const data = changePasswordSchema.parse(req.body)
        await this.authService.changePassword(userId,data)

        return sendSuccessResponse(
            res,
            {},
            SUCCESS_MESSAGES.AUTH.PASSWORD_CHANGED,
            HTTP_STATUS.OK
        )
    }

    changeEmail = async (req:Request,res:Response)=>{
        const userId = req.user?.id
        if(!userId){
            throw new AppError(ERROR_MESSAGES.USER.NOT_FOUND,HTTP_STATUS.NOT_FOUND)
        }
        const data = changeEmailSchema.parse(req.body)

        await this.authService.changeEmail(userId,data)

        return sendSuccessResponse(
            res,
            {},
            SUCCESS_MESSAGES.AUTH.EMAIL_CHANGED,
            HTTP_STATUS.OK
        )
    }
}