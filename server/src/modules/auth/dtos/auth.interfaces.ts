import { RegisterDTO } from "./auth.schema.js";
import { Auth, User , BodyMetric} from "@prisma/client";;

export type ExtendedAuth = Auth & {
    user:User & {
        bodyMetrics: BodyMetric[]
    }
}

export interface IAuthRepository{
    create(data:RegisterDTO & {passwordHash:string }): Promise<ExtendedAuth>

    findByEmail(email:string):Promise <ExtendedAuth | null >;

    findById(id:string): Promise <ExtendedAuth | null>;

    updatePassword(id:string,newHash:string): Promise < ExtendedAuth| null >;

    updateEmail(id:string, newEmail:string): Promise < ExtendedAuth| null >;
}

