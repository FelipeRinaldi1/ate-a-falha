import { BodyMetricsModel } from "../model/body-metrics.model.js";
import { createBodyMetricsDTO, UpdateBodyMetricsDTO } from "./body-metrics.schema.js";

export interface IBodyMetricsRepository{
    create(bodyMetrics: createBodyMetricsDTO): Promise<BodyMetricsModel>;
    findByUserId(userId: string): Promise<BodyMetricsModel[]>;
    findById(id: string): Promise<BodyMetricsModel | null>;
    update(id: string, data: UpdateBodyMetricsDTO): Promise<BodyMetricsModel | null>;
    delete(id: string): Promise<boolean>;
}