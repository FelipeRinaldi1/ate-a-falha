import * as z from "zod";
import { GENDER_OPTIONS } from "../../../@constants/global/genderOptions.js";
import { RULES } from "../../../@constants/rules/index.js"
import { VALIDATION_MESSAGES } from "../../../@constants/messages/validation/index.js";
import { GENDER } from "@prisma/client";

export const userProfileSchema = z.object({
    name: z.string().min(RULES.USER.NAME.MIN_LENGTH,{error:VALIDATION_MESSAGES.USER.NAME.MIN}),

    birthDate: z.coerce.date()
    .max(new Date(),{error:VALIDATION_MESSAGES.USER.BIRTH_DATE.FUTURE})
    .min(new Date("1900-01-01"),{error:VALIDATION_MESSAGES.USER.BIRTH_DATE.TOO_OLD})
    .refine((date)=>{
        const ageDifms = Date.now() - date.getTime();
        const ageDate = new Date(ageDifms);
        const age = Math.abs(ageDate.getUTCFullYear()-1970);
        return age >= RULES.USER.AGE.MIN;
    },        
    {
        error: VALIDATION_MESSAGES.USER.BIRTH_DATE.MIN_AGE(RULES.USER.AGE.MIN)
    }),

    gender: z.enum(GENDER,{
        error:(issue)=>{
            if(issue.input === undefined){
                return VALIDATION_MESSAGES.USER.GENDER.REQUIRED;
            }
            return VALIDATION_MESSAGES.USER.GENDER.INVALID
        }
    })
})

export const userCredentialSchema = z.object({

    email: z.email({error:VALIDATION_MESSAGES.AUTH.EMAIL.INVALID}),
    
    password: z.string().min(RULES.AUTH.PASSWORD.MIN_LENGTH,{error:VALIDATION_MESSAGES.AUTH.PASSWORD.MIN})
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_LOWERCASE,VALIDATION_MESSAGES.AUTH.PASSWORD.LOWER)
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_UPPERCASE,VALIDATION_MESSAGES.AUTH.PASSWORD.UPPER)
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_NUMBER,VALIDATION_MESSAGES.AUTH.PASSWORD.NUMBER)
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_SPECIAL_CHAR,VALIDATION_MESSAGES.AUTH.PASSWORD.SPECIAL)
})

export const physicalStatsSchema = z.object({
    weight: z.number({error:(issue)=>{
        if(issue.input === undefined)
        {
            return VALIDATION_MESSAGES.PHYISICAL.NUMBER.INVALID
        }
        return VALIDATION_MESSAGES.PHYISICAL.WEIGHT.REQUIRED
    }}).positive({error:VALIDATION_MESSAGES.PHYISICAL.WEIGHT.POSITIVE}),

    height: z.number({error:(issue)=>{
        if(issue.input === undefined)
        {
            return VALIDATION_MESSAGES.PHYISICAL.NUMBER.INVALID
        }
        return VALIDATION_MESSAGES.PHYISICAL.HEIGHT.REQUIRED
    }}).positive({error:VALIDATION_MESSAGES.PHYISICAL.HEIGHT.POSITIVE}),
    
    activityLevel: z.number().int()
    .min(RULES.PHYSICAL.ACTIVITY_LEVEL.MIN,{error:VALIDATION_MESSAGES.PHYISICAL.ACTIVITY_LEVEL.MIN})
    .max(RULES.PHYSICAL.ACTIVITY_LEVEL.MAX,{error:VALIDATION_MESSAGES.PHYISICAL.ACTIVITY_LEVEL.MAX}),
    
    bodyFat: z.number()
    .min(RULES.PHYSICAL.FAT_PERCENTAGE.MAX,{error:VALIDATION_MESSAGES.PHYISICAL.FAT_PERCENTAGE.MIN})
    .max(RULES.PHYSICAL.FAT_PERCENTAGE.MAX,{error:VALIDATION_MESSAGES.PHYISICAL.FAT_PERCENTAGE.MAX})
    .positive()
    .optional(),
    
    muscleRate: z.number()
    .min(RULES.PHYSICAL.MUSCLE_MASS_PERCENTAGE.MAX,{error:VALIDATION_MESSAGES.PHYISICAL.MUSCLE_MASS_PERCENTAGE.MIN})
    .max(RULES.PHYSICAL.MUSCLE_MASS_PERCENTAGE.MAX,{error:VALIDATION_MESSAGES.PHYISICAL.MUSCLE_MASS_PERCENTAGE.MAX})
    .positive()
    .optional(),
})

export const registerSchema = userCredentialSchema.extend({...userProfileSchema.shape}).extend({...physicalStatsSchema.shape})

export const loginSchema = z.object({
    email: z.email({error: VALIDATION_MESSAGES.AUTH.EMAIL.INVALID}),
    password: z.string({error:VALIDATION_MESSAGES.AUTH.EMAIL.INVALID})
})

export const tokenPayLoadSchema = z.object({
    id: z.string(),
    email: z.email(),
    iat: z.number().optional(), //Issue At
    exp: z.number().optional() // Expires in
})

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(RULES.AUTH.PASSWORD.MIN_LENGTH,{error:VALIDATION_MESSAGES.AUTH.PASSWORD.REQUIRED}),

    newPassword: z.string().min(RULES.AUTH.PASSWORD.MIN_LENGTH,{error:VALIDATION_MESSAGES.AUTH.PASSWORD.MIN})
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_LOWERCASE,VALIDATION_MESSAGES.AUTH.PASSWORD.LOWER)
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_UPPERCASE,VALIDATION_MESSAGES.AUTH.PASSWORD.UPPER)
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_NUMBER,VALIDATION_MESSAGES.AUTH.PASSWORD.NUMBER)
    .regex(RULES.AUTH.PASSWORD.REGEX.HAS_SPECIAL_CHAR,VALIDATION_MESSAGES.AUTH.PASSWORD.SPECIAL)
})

.refine((data)=> data.oldPassword !== data.newPassword,{
    error:VALIDATION_MESSAGES.AUTH.PASSWORD.DIFFERENT,
    path:["newPassword"]
})

export const changeEmailSchema = z.object({
    newEmail: z.email({error:VALIDATION_MESSAGES.AUTH.EMAIL.INVALID}),
    password: z.string().min(RULES.AUTH.PASSWORD.MIN_LENGTH,{error:VALIDATION_MESSAGES.AUTH.PASSWORD.REQUIRED})
})


//Extracts types
export type RegisterDTO = z.infer<typeof registerSchema>
export type LoginDTO = z.infer<typeof loginSchema>
export type TokenPayLoadDTO = z.infer<typeof tokenPayLoadSchema>
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>
export type ChangeEmailDTO = z.infer<typeof changeEmailSchema>