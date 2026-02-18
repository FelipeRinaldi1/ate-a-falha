import {prisma} from "../../../infra/prisma.js";
import { IBodyMetricsRepository } from "../interfaces/body-metrics.interfaces.js";
import { createBodyMetricsDTO, UpdateBodyMetricsDTO } from "../interfaces/body-metrics.schema.js";
import { BodyMetricsModel } from "../model/body-metrics.model.js";

export class BodyMetricsRepository implements IBodyMetricsRepository{

    async create(data: createBodyMetricsDTO): Promise<BodyMetricsModel> {
        const newBodyMetric = await prisma.bodyMetric.create({
            data:data
        })
        return newBodyMetric
    }

    async findByUserId(userId: string): Promise<BodyMetricsModel[]> {
        const bodyMetrics = await prisma.bodyMetric.findMany({
            where: {userId: userId}
        })
        return bodyMetrics
    }

    async findById(id: string): Promise<BodyMetricsModel | null> {
        const bodyMetric = await prisma.bodyMetric.findUnique({
            where: {id: id}
        })
        return bodyMetric
    }

    async update(id: string, data: UpdateBodyMetricsDTO): Promise<BodyMetricsModel | null> {
        const updatedBodyMetric = await prisma.bodyMetric.update({
            where: {id: id},
            data: data
        })
        return updatedBodyMetric
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.bodyMetric.delete({
                where: {id: id}
            })
            return true
        } catch (error) {
            return false
        }
    }
}