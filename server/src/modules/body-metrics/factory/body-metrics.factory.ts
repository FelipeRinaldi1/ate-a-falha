import { BodyMetricsRepository } from "../repositories/body-metrics.repository.js";
import { BodyMetricsService } from "../services/body-metrics.service.js";
import { BodyMetricsController } from "../http/body-metrics.controller.js";

export class BodyMetricsFactory {
    static create() {
        const repository = new BodyMetricsRepository();
        const service = new BodyMetricsService(repository);
        const controller = new BodyMetricsController(service);
        return controller;
    }
}