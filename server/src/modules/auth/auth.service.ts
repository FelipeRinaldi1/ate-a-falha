import {prisma} from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt,{SignOptions} from "jsonwebtoken"
import { RegisterDTO,LoginDTO } from "./auth.schema.js";
import { AppError } from "../../errors/appError.js";
import { ENV } from "../../@constants/env.js";

import { ERROR_MESSAGES } from "../../@constants/global/messagesConstants.js";
import { HTTP_STATUS } from "../../@constants/global/httpCodesConstants.js";
import { PRISMA_ERRORS } from "../../@constants/global/prismaConstants.js";

class AuthService{
    constructor(){}

    /**
     * Registers a new user in the system.
     * * This function hashes the password hash for the security and tries to persist the user in the database
     * If the email is already in use, throw a exception
     * @param data - DTO containing name,email and a plain password
     * @returns Returns a user object ommiting the password
     * @throws {Error} "Email already registered" - If the email unique constraint is violated.
     */
    async registerUser(data:RegisterDTO){

        //Password Hash
        const passwordHash = await bcrypt.hash(data.password,10);

        //Tries to register in database
        try{
            const newUser = await prisma.user.create({
            data:{
                name: data.name,
                email: data.email,
                password: passwordHash
            }
        })
        //Removes password
        const {password,...userWithoutPassword} = newUser;
        return userWithoutPassword;

        }catch(error:any){
            if(error.code===PRISMA_ERRORS.UNIQUE_CONSTRAINT){
                throw new AppError(ERROR_MESSAGES.USER.ALREADY_EXISTS,HTTP_STATUS.CONFLICT,{internalCode:PRISMA_ERRORS.UNIQUE_CONSTRAINT})
            }
            throw error;
        }
    }


    /**
     * Authenticates a user against the system.
     * * This function verifies if the user exists and validate the provided password against the stored hash.
     * * If authentication succeeds, it generates and returns a signed JWT access token.
     * @param data - The DTO containing the login credentials (email and password).
     * @returns An object containing the public user profile (omitting the password) and the jwt token
     * @throws {Error} "Email or Password Invalid"
     */
    async loginUser(data:LoginDTO){
        const user = await prisma.user.findUnique({
            where:{email:data.email}
        })

        if(!user){
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,HTTP_STATUS.UNAUTHORIZED)
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password)

        if (!isPasswordValid){
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,HTTP_STATUS.UNAUTHORIZED)
        }

        //JWT Token
        const token = jwt.sign(
            {id:user.id,email:user.email},
            ENV.JWT_SECRET,
            {subject:user.id,
            expiresIn:ENV.JWT_EXPIRES_IN} as SignOptions
        )

        //removes password from user Json
        const {password,...userWithoutPassword} = user

        return {
            user:userWithoutPassword,
            token:token
        }
    }

}

export default new AuthService();