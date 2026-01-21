export const VALIDATION_RULES = {
    NAME:{
        MIN_LENGTH:3,
        MAX_LENGTH:128
    },
    PASSWORD:{
        MIN_LENGTH:3,
        MAX_LENGTH:64,
        REGEX:{
            HAS_LOWERCASE: /[a-z]/,
            HAS_UPPERCASE:/[A-Z]/,
            HAS_NUMBER:/\d/,
            HAS_SPECIAL_CHAR:/[^a-zA-Z0-9]/
        }
    }
} as const