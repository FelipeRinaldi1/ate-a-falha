import { BodyMetricsModel } from "../model/body-metrics.model.js";

export class BodyMetricsMapper{
    static toHTTP(bodyMetrics: BodyMetricsModel){
        return {
            id: bodyMetrics.id,
            userId: bodyMetrics.userId,
            weight: bodyMetrics.weight,
            height: bodyMetrics.height,
            activityLevel: bodyMetrics.activityLevel,
            bodyFat: bodyMetrics.bodyFat ?? 0,
            muscleRate: bodyMetrics.muscleRate ?? 0,
            createdAt: bodyMetrics.createdAt,
            updatedAt: bodyMetrics.updatedAt
        }
    }
}