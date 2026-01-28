export const SUCCESS_MESSAGES = {
    AUTH: {
        REGISTER: "User registered successfully.",
        LOGIN: "Login successful.",
        LOGOUT: "Logout successful.",
        PASSWORD_CHANGED: "Password updated successfully.",
        EMAIL_CHANGED:"Email updated sucessfully"
    },
    USER: {
        PROFILE_UPDATED: "Profile updated successfully.",
        ACCOUNT_DELETED: "Account deleted successfully."
    },
    SYSTEM: {
        HEALTH_CHECK: "Server is healthy and running."
    }
} as const;