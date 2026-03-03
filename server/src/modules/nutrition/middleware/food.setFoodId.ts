import {Request,Response, NextFunction } from "express"

export const setFoodId = (req:Request,res:Response,next: NextFunction)=>{
    const {id} = req.params

    if(!id){
        next(); return;
    }

    req.foodId = id;
    next()
}