import {prisma} from "../../../infra/client.js"
import { Prisma } from "@prisma/client"
import { IAuthRepository, ExtendedAuth } from "../dtos/auth.interfaces.js"
import { RegisterDTO } from "../dtos/auth.schema.js"

import { AppError } from "../../../@utils/appError.js"
import { PRISMA_ERRORS } from "../../../@constants/prisma/prismaConstants.js"
import { ERROR_MESSAGES } from "../../../@constants/messages/errors.messages.js"
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js"

export class AuthRepository implements IAuthRepository{
    async create(data: RegisterDTO & { passwordHash: string }): Promise<ExtendedAuth>{
        try{
            return await prisma.$transaction(async (transaction) => {
            const newUser = await transaction.user.create({
                data: {
                    name: data.name,
                    birthDate:data.birthDate,
                    gender:data.gender
                }
            });

            const newBodyMetrics = await transaction.bodyMetric.create({
                data:{
                    weight:data.weight,
                    height:data.height,
                    activityLevel:data.activityLevel,
                    bodyFat:data.bodyFat,
                    muscleRate:data.muscleRate,
                    userId:newUser.id
                }
            })

            const newAuth = await transaction.auth.create({
                data: {
                    email: data.email,
                    password: data.passwordHash,
                    userId: newUser.id
                }
            });

            return {
                ...newAuth,
                user:{
                    ...newUser,
                    bodyMetrics: [newBodyMetrics]
                }
            }
        })}
        catch(error){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT){
                    throw new AppError(ERROR_MESSAGES.CONFLICT.EMAIL_ALREADY_EXISTS,HTTP_STATUS.CONFLICT)
                }
            }
            throw error;
        }
    }

    async findByEmail(email: string): Promise<ExtendedAuth | null> {
        return await prisma.auth.findUnique({
            where: {email:email},
            include:{
                user:{
                    include:{bodyMetrics:true}
                }
            }
        })
    }

    async findById(id:string):Promise <ExtendedAuth | null> {
        return await prisma.auth.findUnique({
            where:{userId:id},
            include:{
                user:{
                    include:{bodyMetrics:true}
                }
            }
        })
    }

    async updatePassword(id: string, newHash: string): Promise<ExtendedAuth | null> {

        return await prisma.auth.update({
            where:{userId:id},
            data:{password:newHash},
            include:{
                user:{
                    include:{bodyMetrics:true}
                }
            }
        })
    }

    async updateEmail(id: string, newEmail: string): Promise<ExtendedAuth | null> {
        try{
            return await prisma.auth.update({
                where:{userId:id},
                data:{email:newEmail},
                include:{
                    user:{
                        include:{bodyMetrics:true}
                    }
                }
            })
        }catch(error){
            if(error instanceof Prisma.PrismaClientKnownRequestError){
                if(error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT){
                    throw new AppError(ERROR_MESSAGES.CONFLICT.EMAIL_ALREADY_EXISTS,HTTP_STATUS.CONFLICT)
                }
            }
            throw error
        }
    }
}
