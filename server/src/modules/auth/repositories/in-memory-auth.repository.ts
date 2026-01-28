import { IAuthRepository, ExtendedAuth } from "../dtos/auth.interfaces.js";
import { RegisterDTO } from "../dtos/auth.schema.js";
import { AppError } from "../../../@utils/appError.js";
import { ERROR_MESSAGES } from "../../../@constants/messages/errors.messages.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { logger } from "../../../config/logger.js";
import { GENDER } from "@prisma/client";
import { randomUUID } from "crypto";

interface UserMemory{
    id:string;
    name:string;
    birthDate:Date,
    gender: GENDER;
    createdAt:Date;
    updatedAt:Date;
}
interface AuthMemory{
    id:string;
    email:string;
    password:string;
    userId:string;
    createdAt:Date;
    updatedAt:Date
}
interface BodyMetricsMemory{
    id:string;
    weight:number;
    height:number;
    activityLevel:number;
    bodyFat:number | null;
    muscleRate:number | null;
    userId:string;
    createdAt:Date;
}

export class InMemoryAuthRepository implements IAuthRepository{
    public users:UserMemory[] = [];
    public auths:AuthMemory[] = [];
    public bodyMetrics:BodyMetricsMemory[] = [];

    async create(data: RegisterDTO &{passwordHash:string}):Promise <ExtendedAuth>{
        logger.info({email:data.email}, "InMemoryRepo: Starting user creaation ")

        const emailExists = this.auths.find(auth=>auth.email === data.email)

        if(emailExists){
            logger.warn({email:data.email}, "InMemoryRepo: Duplicate email registration blocked")
            throw new AppError(ERROR_MESSAGES.CONFLICT.EMAIL_ALREADY_EXISTS,HTTP_STATUS.CONFLICT)
        }

        const userId=randomUUID();
        const authId=randomUUID();
        const metricId=randomUUID();
        const now = new Date();

        const newUser:UserMemory={
            id:userId,
            name:data.name,
            birthDate: data.birthDate,
            gender:data.gender,
            createdAt: now,
            updatedAt: now
           
        }
        
        this.users.push(newUser)

        const newAuth:AuthMemory={
            id:authId,
            email:data.email,
            password:data.passwordHash,
            userId:newUser.id,
            createdAt: now,
            updatedAt: now
        }
        this.auths.push(newAuth)

        const newBodyMetric:BodyMetricsMemory={
            id:metricId,
            weight:data.weight,
            height:data.height,
            activityLevel:data.activityLevel,
            bodyFat:data.bodyFat ?? null,
            muscleRate:data.muscleRate ?? null,
            userId:newUser.id,
            createdAt:now,
        }

        this.bodyMetrics.push(newBodyMetric)

        logger.info({userId: newUser.id},"InMemoryRepo: User created successfully")

        return{
            ...newAuth,
            user: {
                ...newUser,
                bodyMetrics: [newBodyMetric]
            }
        }
    }
    async findByEmail(email:string):Promise <ExtendedAuth | null >{
        const auth = this.auths.find((auth)=>auth.email===email)
        if(!auth) return null
        const user = this.users.find((user)=>user.id === auth?.userId)
        if (!user) return null
        const bodyMetrics = this.bodyMetrics.find((bodyMetrics)=>bodyMetrics.userId === user.id)
        if(!bodyMetrics) return null

        return {
            ...auth,
            user:{
                ...user,
                bodyMetrics: [bodyMetrics]
            }
        }
    };

    async findById(id:string): Promise <ExtendedAuth | null>{

        const auth = this.auths.find((auth)=>auth.userId===id)
        if(!auth) return null
        const user = this.users.find((user)=>user.id ===auth.userId)
        if(!user) return null
        const bodyMetrics = this.bodyMetrics.find((bodyMetrics)=>bodyMetrics.userId === user.id)
        if(!bodyMetrics) return null

        return {
            ...auth,
            user:{
                ...user,
                bodyMetrics: [bodyMetrics]
            }
        }
    };

    async updatePassword(id:string,newHash:string): Promise < ExtendedAuth| null >{
        const authIndex = this.auths.findIndex((auth)=>auth.userId=== id )
        if(authIndex===-1){
            return null
        }

        this.auths[authIndex].password = newHash;
        this.auths[authIndex].updatedAt = new Date();
        
        logger.info({userId:id}, "InMemoryRepo: Password updated successfully")
        return this.findById(id)
    };

    async updateEmail(id:string, newEmail:string): Promise < ExtendedAuth| null >{
        logger.info({userId:id, newEmail},"InMemoryRepo: Initiating email update")

        const emailAlreadyExists=this.auths.find(
            auth=>auth.email===newEmail&&auth.userId!==id
        );
        if(emailAlreadyExists){
            logger.warn({userId:id,newEmail},"InMemoryRepo: Email cupdate conflict detected")
            throw new AppError(ERROR_MESSAGES.CONFLICT.EMAIL_ALREADY_EXISTS,HTTP_STATUS.CONFLICT)
        }

        const authIndex = this.auths.findIndex((auth)=>auth.userId===id)
        if(authIndex ===-1){
            logger.debug({userId:id},"InMemoryRepo: User not found for email update")
            return null;
        }

        this.auths[authIndex].email = newEmail
        this.auths[authIndex].updatedAt = new Date();

        logger.info({userId: id}, "InMemoryRepo: Email updated succesffully")
        return this.findById(id)
    };
}