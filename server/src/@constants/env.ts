import 'dotenv/config'

if (!process.env.JWT_SECRET){
    throw new Error("Fatal Error: JWT_SECRET not defined in .env")
}

if(!process.env.JWT_EXPIRES_IN){
    throw new Error("Fatal Error: JWT_EXPIRES_IN not defined in .env")
}

export const ENV = {
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN ||'1d',
    PORT: process.env.PORT || 3333,
    NODE_ENV: process.env.NODE_ENV || 'development'
} as const