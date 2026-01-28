export const ENV_ERRORS= {
        FATAL_ERROR: "Fatal Error: Invalid environment variables configuration. Server cannot start.",


        INVALID_VARIABRLES:"Invalid environment variables: ",
        REQUIRED: "This environment variable is mandatory.",
        INVALID_NUMBER: "This variable must be a valid number.",
        INVALID_URL: "This variable must be a valid URL.",
        
        PORT_INVALID: "PORT must be a valid number (e.g. 3333).",
        NODE_ENV_INVALID: "NODE_ENV must be strictly 'development', 'production', or 'test'.",
        JWT_SECRET_MISSING: "JWT_SECRET is critical and cannot be empty.",
        DB_URL_MISSING: "DATABASE_URL is required to connect to the database."
} as const
