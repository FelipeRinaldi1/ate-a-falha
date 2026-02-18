import {z} from "zod";
import { DietUncheckedCreateInputSchema, DietUncheckedUpdateInputSchema } from "../../../generated/zod/index.js";

export const CreateDietSchema = DietUncheckedCreateInputSchema;

export const UpdateDietSchema = DietUncheckedUpdateInputSchema;

export type CreateDietDTO = z.infer<typeof CreateDietSchema>;

export type UpdateDietDTO = z.infer<typeof UpdateDietSchema>;