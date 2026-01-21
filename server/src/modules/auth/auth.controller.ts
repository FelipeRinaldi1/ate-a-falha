import { Request,Response } from "express";
import authService from "./auth.service.js"
import { registerSchema,loginSchema, } from "./auth.schema.js";
import { sendSuccessResponse } from "../../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../../@constants/global/httpCodesConstants.js";
import { SUCCESS_MESSAGES } from "../../@constants/global/messagesConstants.js";

class AuthController{
    constructor(){}

    async handleRegister(req:Request,res:Response){

        const payload = registerSchema.parse(req.body)

        const result = await authService.registerUser(payload)

        return sendSuccessResponse(
            res,
            result,
            SUCCESS_MESSAGES.AUTH.REGISTER,
            HTTP_STATUS.CREATED
        )
    }

    async handleLogin(req:Request,res:Response){

        const payload = loginSchema.parse(req.body)

        const result = await authService.loginUser(payload)

        return sendSuccessResponse(
            res,
            result,
            SUCCESS_MESSAGES.AUTH.LOGIN,
            HTTP_STATUS.OK
        )
    }
}

export default new AuthController