export const PHYSICAL_MESSAGES = {
    NUMBER: {
        INVALID: "Must be a Number",
    },
    HEIGHT: {
        REQUIRED: "Height is required",
        POSITIVE: "Height must be positive"
    },
    WEIGHT: {
        REQUIRED: "Weight is required",
        POSITIVE: "Weight must be positive"
    },
    ACTIVITY_LEVEL: {
        REQUIRED: "Activity level is required.",
        INVALID: "Invalid activity level.",
        MIN: "Activity level cannot be lower than 1.",
        MAX: "Activity level cannot be higher than 7."
    },
    FAT_PERCENTAGE: {
        MIN: "Fat percentage is unrealistically low.",
        MAX: "Fat percentage is too high."
    },
    MUSCLE_MASS_PERCENTAGE: {
        MIN: "Muscle mass percentage is unrealistically low.",
        MAX: "Muscle mass percentage is too high."
    }
} as const;