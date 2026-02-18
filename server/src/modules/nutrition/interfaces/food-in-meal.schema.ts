import {z} from 'zod';

import { FoodInMealUncheckedCreateInputSchema, FoodInMealUncheckedUpdateInputSchema } from '../../../generated/zod/index.js';

export const foodInMealSchema = FoodInMealUncheckedCreateInputSchema;

export const updateFoodInMealSchema = FoodInMealUncheckedUpdateInputSchema;

export type FoodInMealDTO = z.infer<typeof foodInMealSchema>;
export type UpdateFoodInMealDTO = z.infer<typeof updateFoodInMealSchema>;