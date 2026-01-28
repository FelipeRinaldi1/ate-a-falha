export const AUTH_RULES = {
    PASSWORD: {
        MIN_LENGTH: 6, 
        MAX_LENGTH: 64,
        REGEX: {
            HAS_LOWERCASE: /[a-z]/,
            HAS_UPPERCASE: /[A-Z]/,
            HAS_NUMBER: /\d/,
            HAS_SPECIAL_CHAR: /[^a-zA-Z0-9]/
        }
    },
    BCRYPT_ROUNDS:10
} as const;