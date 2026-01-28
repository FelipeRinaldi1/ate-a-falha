export const AUTH_MESSAGES = {
    EMAIL: {
        INVALID: "Invalid email format."
    },
    PASSWORD: {
        REQUIRED: "Password is Required",
        DIFFERENT: "Password must be different from the old one",
        INVALID: "Invalid password format.",
        MIN: "Password must have at least 6 characters",
        LOWER: "Must contain lowercase",
        UPPER: "Must contain uppercase",
        NUMBER: "Must contain a number",
        SPECIAL: "Must contain a special character"
    },
    TOKEN: {
        INVALID: "Token invalid or expired.",
        MISSING: "Authentication token not provided."
    }
} as const;