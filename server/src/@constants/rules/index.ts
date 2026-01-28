import { AUTH_RULES } from "./auth.rules.js";
import { PHYSICAL_RULES }  from "./physical.rules.js";
import { USER_RULES } from "./user.rules.js";

export const RULES={
    AUTH:AUTH_RULES,
    USER:USER_RULES,
    PHYSICAL: PHYSICAL_RULES,
} as const