export const ERROR_MESSAGES={
    USER:{
        ALREADY_EXISTS:"Email already registered.",
        NOT_FOUND:"User not found."
    },
    AUTH:{
        INVALID_TOKEN: "Token invalid or expired.",
        MISSING_TOKEN: "Authentication token not provided.",
        INVALID_CREDENTIALS:"Email or password invalid"
    },
    VALIDATION:{
        DEFAULT: "Validation Error",
        EMAIL_INVALID_FORMAT:"Invalid email format.",
        PASSWORD_INVALID_FORMAT:"Invalid password format.",
    }
} as const

export const SUCCESS_MESSAGES={
    AUTH:{
        REGISTER: "User registered successfully.",
        LOGIN: "Login successfully"
    }
} as const

export const VALIDATION_MESSAGES ={
    NAME:{
        MIN:"Name must have at least 3 characters",
    },
    EMAIL:{
        INVALID:"Invalid email format."
    },
    PASSWORD:{
        INVALID:"Invalid password format.",
        MIN:"Password must have at least 6 characters",
        LOWER:"Must contain lowercase",
        UPPER:"Must contain uppercase",
        NUMBER: "Must contain a number",
        SPECIAL: "Must contain a special character"
    }
} as const