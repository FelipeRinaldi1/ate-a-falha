export const USER_MESSAGES = {
    NAME: {
        MIN: "Name must have at least 3 characters",
    },
    BIRTH_DATE: {
        REQUIRED: "Birth date is required.",
        INVALID: "Invalid date format.",
        FUTURE: "Date cannot be in the future.",
        TOO_OLD: "Date is too far in the past.",
        MIN_AGE: (minAge: number) => `You must be at least ${minAge} years old.`
    },
    GENDER: {
        REQUIRED: "Gender is required.",
        INVALID: "Please select a valid gender option."
    }
} as const;