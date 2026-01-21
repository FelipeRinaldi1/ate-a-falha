import { Request,Response } from "express";
import userService from "./user.service.js";

class UserController{
    constructor(){};

    async getMe(req:Request,res:Response){
        try{

            if(!req.user?.id){
                return res.status(401).json({error:"Not authenticated"})
            }

            const userId = req.user!.id;

            const user = await userService.findById(userId)

            return res.status(200).json(user)

        }catch(error:any){
            if(error.message === "User not found"){
                return res.status(404).json({error:"Profile not found"})
            }

            console.error("Error in getMe function:",error)

            return res.status(500).json({error:"Internal server error"})
        }
    }

}

export default new UserController();