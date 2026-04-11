import {z} from 'zod'
import { GENDER } from "../schemas/user/user.schema.js";

export class BodyMetricLogic{
    static calculateBMI(weight:number,height:number):number{
        return weight / (height * height);
    }

    static calculateBMR(gender:z.infer<typeof GENDER>,weight:number,height:number,age:number):number{
        if (gender === GENDER.enum.MALE) {
            return 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            return 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    static calculateTDEE(bmr: number, activityLevel: number): number {
        const levels = [1.2, 1.375, 1.55, 1.725, 1.9];

        const multiplier = levels[activityLevel] ?? 1.2;

        return bmr * multiplier;
    }
}