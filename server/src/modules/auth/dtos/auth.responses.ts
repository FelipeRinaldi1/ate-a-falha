export interface AuthResponseDTO{
    id:string;
    name:string;
    email:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface LoginResponseDTO{
    user:AuthResponseDTO;
    token: string;
}