import {z} from "zod";

export const BodyMetricsSchema = z.object({
    weight: z.number().positive(),
    height: z.number().positive(),
    activityLevel: z.number().min(1).max(7),
    bodyFat: z.number().min(0).max(100).optional(),
    muscleRate: z.number().min(0).max(100).optional(),
    userId: z.uuid(),
});

export const UpdateBodyMetricsSchema = BodyMetricsSchema.partial();

export type createBodyMetricsDTO = z.infer<typeof BodyMetricsSchema>;
export type UpdateBodyMetricsDTO = z.infer<typeof UpdateBodyMetricsSchema>;