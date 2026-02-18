import {z} from 'zod';
import { MealUncheckedCreateInputSchema,MealUncheckedUpdateInputSchema } from '../../../generated/zod/index.js';

export const mealSchema = MealUncheckedCreateInputSchema;

export const updateMealSchema = MealUncheckedUpdateInputSchema;

export type MealDTO = z.infer<typeof mealSchema>;
export type UpdateMealDTO = z.infer<typeof updateMealSchema>;