import { ExtendedAuth } from "../dtos/auth.interfaces.js"

export class AuthMapper{

    static toHTTP(authData: ExtendedAuth){
        return {
            id:authData.user.id,
            name:authData.user.name,
            email:authData.email,
            role:authData.user.role,

            createdAt: authData.user.createdAt,
            updatedAt: authData.user.updatedAt
        }
    }

    static toLogin(token:string,account:ExtendedAuth){
        return{
            token: token,
            user:AuthMapper.toHTTP(account),
        }
    }
}
