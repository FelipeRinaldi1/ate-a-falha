import * as z from "zod";
import { VALIDATION_RULES } from "../../@constants/global/validationRulesConstants.js";
import { VALIDATION_MESSAGES } from "../../@constants/global/messagesConstants.js";

export const registerSchema = z.object({
    name: z.string().min(VALIDATION_RULES.NAME.MIN_LENGTH,{message:VALIDATION_MESSAGES.NAME.MIN}),
    email: z.email({message:VALIDATION_MESSAGES.EMAIL.INVALID}),
    password: z.string().min(VALIDATION_RULES.PASSWORD.MIN_LENGTH,{message:VALIDATION_MESSAGES.PASSWORD.MIN})
    .regex(VALIDATION_RULES.PASSWORD.REGEX.HAS_LOWERCASE,VALIDATION_MESSAGES.PASSWORD.LOWER)
    .regex(VALIDATION_RULES.PASSWORD.REGEX.HAS_UPPERCASE,VALIDATION_MESSAGES.PASSWORD.UPPER)
    .regex(VALIDATION_RULES.PASSWORD.REGEX.HAS_NUMBER,VALIDATION_MESSAGES.PASSWORD.NUMBER)
    .regex(VALIDATION_RULES.PASSWORD.REGEX.HAS_SPECIAL_CHAR,VALIDATION_MESSAGES.PASSWORD.SPECIAL)
})

export const loginSchema = z.object({
    email: z.email({message: VALIDATION_MESSAGES.EMAIL.INVALID}),
    password: z.string({message:VALIDATION_MESSAGES.PASSWORD.INVALID})
})

export const tokenPayLoadSchema = z.object({
    id: z.string(),
    email: z.email(),
    iat: z.number().optional(), //Issue At
    exp: z.number().optional() // Expires in
})

//Extracts types
export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>

export type TokenPayLoadDTO = z.infer<typeof tokenPayLoadSchema>