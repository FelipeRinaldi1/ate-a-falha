import { Request } from "express";
import { string } from "zod";

declare global {
    namespace Express{
        interface Request{
            user?:{
                id:string;
                email:string;
                role: 'ADMIN' | 'USER';
            },
            userId?: string,

            foodId?: string,
        }
    }
}