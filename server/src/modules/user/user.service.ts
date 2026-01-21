import {prisma} from '../../lib/prisma.js'
import { UpdateUserDTO, GetMeDTO } from './user.schema.js'
import { defaultUserSelect } from './user.constants.js'
import bcrypt from 'bcryptjs'

import { AppError } from '../../errors/appError.js'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../@constants/global/messagesConstants.js'
import { HTTP_STATUS } from '../../@constants/global/httpCodesConstants.js'

class UserService{
    constructor(){}

    //Get
    /**
     * * Retrieves a user's profile data by their unique ID.
     * * This method selects only public/safe fields to be sent to the front-end
     * *@param userId - the UUID of the user to retrieve.
     * @returns The user object containing id, name, email, and timestamps
     * @throws {Error}^If the user is not found in the database.
     */
    async findById(userId:string){
        const user = await prisma.user.findUnique({
            where: {id:userId},
            select: defaultUserSelect
            
        })
        if(!user){
            throw new Error("User not found") 
        }
        return user;
    }

    //Patch
    /**
     * * Updates a specific fields of an existing user profile.
     * * This method applies partial updates to the user record and returns the updated user.
     * if the user ID provided does not exist, a specific "User not found" error is thrown
     * * @param userId - The UUID of the user to be updated.
     * @param data - The DTO containing the fields to update
     * @returns The updated user object, filtered to exclude sensitive fields like passowrd
     * @throws {Error} "User not found"
     */
    async updateUser(userId:string,data:UpdateUserDTO){
        try{
            const updatedUser = await prisma.user.update({
            where:{id:userId},
            data:{...data},
            select: defaultUserSelect
        })
            return updatedUser;
        }catch(error:any){
            if (error.code==='P2025'){
                throw new Error("User not Found");
            }
            throw error;
        }
    }
    
    /**
     * * Permanently removes a user account from database by their unique ID.
     * * This method is irreversible. It returns basic user info for confirmation before deletion
     * @param userId - The UUID of the user to be deleted.
     * @returns The deleted user object (id,name,email) for log/confirmation.
     * @throws {Error} "User not Found" - If the provided Id doesnt exist.
     */
    async deleteUser(userId:string){
        try {
            return await prisma.user.delete({
                where:{id:userId},
                select:{name:true,id:true,email:true}
            })
        }catch(error:any){
            if(error.code === 'P2025'){
                throw new Error("User not found")
            }
            throw error;
        }
    }

    /**
     * 
     * @param userId - The UUID of the user to be deleted
     * @param oldPassword - The old password (plain text)
     * @param newPassword - The new password (plain text)
     * @throws {Error} "User not found" or "Invalid current password"
     * @returns JSON Message: Password updated sucessfully
     */
    async changePassword(userId:string, oldPassword:string,newPassword:string){

        const user = await prisma.user.findUnique({
            where:{id:userId},
            select:{password:true}
        })

        if (!user) throw new Error("User not found")

        const isPasswordValid = await bcrypt.compare(oldPassword,user.password);

        if(!isPasswordValid){
            throw new Error("Invalid current password")
        }

        const newPasswordHash = await bcrypt.hash(newPassword,10)

        await prisma.user.update({
            where: {id:userId},
            data:{password:newPasswordHash}
        })

        return {message: "Password updated sucessfully"}
    }


    // TO-DO: FINISH HERE
    async getMe(data:GetMeDTO){
        const user = await prisma.user.findUnique({
            where:{id:data.id}
        })

        if(!user){
            throw new AppError(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED)
        }
        
        return {
            user:user.id,
        }
    }
}

export default new UserService();