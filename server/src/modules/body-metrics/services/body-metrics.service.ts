import { IBodyMetricsRepository } from "../interfaces/body-metrics.interfaces.js";
import { createBodyMetricsDTO } from "../interfaces/body-metrics.schema.js";
import { BodyMetricsMapper } from "../mapper/body-metrics.mapper.js";

export class BodyMetricsService {
    constructor(private bodyMetricsRepository: IBodyMetricsRepository) {}

    async create(data: createBodyMetricsDTO) {
        const newMetrics = await this.bodyMetricsRepository.create(data);
        return BodyMetricsMapper.toHTTP(newMetrics);
    }

    async findByUserId(userId: string) {
        const metrics = await this.bodyMetricsRepository.findByUserId(userId);
        return metrics.map(metric => BodyMetricsMapper.toHTTP(metric));
    }
    
    async findLatestByUserId(userId: string) {
        const metrics = await this.bodyMetricsRepository.findByUserId(userId);
        if (metrics.length === 0) return null;

        const latestMetrics = metrics.reduce((latest, current) => {
            return current.createdAt > latest.createdAt ? current : latest;
        });

        return BodyMetricsMapper.toHTTP(latestMetrics);
    }

    async findById(id: string) {
        const metric = await this.bodyMetricsRepository.findById(id);
        if (!metric) return null;
        
        return BodyMetricsMapper.toHTTP(metric);
    }

    async update(id: string, data: createBodyMetricsDTO) {
        const updatedMetric = await this.bodyMetricsRepository.update(id, data);
        if (!updatedMetric) return null;

        return BodyMetricsMapper.toHTTP(updatedMetric);
    }

    async delete(id: string) {
        return await this.bodyMetricsRepository.delete(id);
    }
}