export const ERROR_MESSAGES = {
    HTTP: {
        INTERNAL_SERVER_ERROR: "Internal server error. Please try again later.",
        NOT_FOUND: "Resource not found.",
        FORBIDDEN: "You do not have permission to access this resource.",
        BAD_REQUEST: "Bad request. Please check your input."
    },
    CONFLICT: {
        EMAIL_ALREADY_EXISTS: "Email is already registered.",
        USERNAME_ALREADY_EXISTS: "Username is already taken."
    },
    AUTH: {
        INVALID_TOKEN: "Token invalid or expired.",
        MISSING_TOKEN: "Authentication token not provided.",
        INVALID_CREDENTIALS: "Email or password invalid."
    },
    USER: {
        NOT_FOUND: "User not found."
    },
    VALIDATION: {
        DEFAULT: "Validation failed. Please check the provided data."
    }
} as const;

