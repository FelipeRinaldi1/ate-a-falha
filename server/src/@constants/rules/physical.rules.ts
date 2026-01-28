export const PHYSICAL_RULES = {
    HEIGHT: {
        MIN: 50,
        MAX: 300
    },
    WEIGHT: {
        MIN: 1,
        MAX: 600
    },
    FAT_PERCENTAGE: {
        MIN: 1,
        MAX: 80
    },
    MUSCLE_MASS_PERCENTAGE: {
        MIN: 1,
        MAX: 80
    },
    ACTIVITY_LEVEL: {
        MIN: 1,
        MAX: 7
    }
} as const;