import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import { AppError } from '../@utils/appError.js' 

const tokenPayloadSchema = z.object({
    sub:z.uuid(),
    role:z.enum(['USER','ADMIN'])
})

export const ensureAuthenticated = (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            const error: AppError = { type: 'UNAUTHORIZED', message: 'Token not provided' }
            throw error
        } 

        const [scheme, token] = authHeader.split(' ')

        if (scheme !== 'Bearer' || !token) {
            const error: AppError = { type: 'UNAUTHORIZED', message: 'Token malformatted' }
            throw error
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

        const result = tokenPayloadSchema.safeParse(decoded)

        if(!result.success){
            throw {
                type:'UNAUTHORIZED',
                message:'Invalid token payload',
                details: result.error.issues
            } as AppError
        }

        const {sub:userId,role} = result.data

        req.user = { id: userId , role:role}
        
        return next()
    } catch (error: any) {
        if (error?.type) return next(error)

        const fallbackError: AppError = { 
            type: 'UNAUTHORIZED', 
            message: 'Invalid, expired or malformed token',
            details: error?.message || 'Unknown error'
        }

        return next(fallbackError)
    
    }
}