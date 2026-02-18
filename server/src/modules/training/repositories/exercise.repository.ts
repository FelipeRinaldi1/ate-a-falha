import { prisma } from "../../../infra/prisma.js";
import { Prisma } from "@prisma/client";
import { IBodyMetricsRepository } from "../../body-metrics/interfaces/body-metrics.interfaces.js";
import { createBodyMetricsDTO,UpdateBodyMetricsDTO } from "../../body-metrics/interfaces/body-metrics.schema.js";
import { BodyMetricsModel } from "../../body-metrics/model/body-metrics.model.js";
import { AppError } from "../../../@utils/appError.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";
import { PRISMA_ERRORS } from "../../../@constants/prisma/prismaConstants.js";

export class BodyMetricsRepository implements IBodyMetricsRepository {

    async create(data: createBodyMetricsDTO): Promise<BodyMetricsModel> {
        try {
            return await prisma.bodyMetric.create({
                data: data
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT) {
                    throw new AppError('Metrics for this period already exist', HTTP_STATUS.CONFLICT);
                }
                if (error.code === PRISMA_ERRORS.FOREIGN_KEY_VIOLATION) {
                    throw new AppError('User not found for these metrics', HTTP_STATUS.NOT_FOUND);
                }
            }
            throw error;
        }
    }

    async findByUserId(userId: string): Promise<BodyMetricsModel[]> {
        return await prisma.bodyMetric.findMany({
            where: { userId: userId }
        });
    }

    async findById(id: string): Promise<BodyMetricsModel | null> {
        return await prisma.bodyMetric.findUnique({
            where: { id: id }
        });
    }

    async update(id: string, data: UpdateBodyMetricsDTO): Promise<BodyMetricsModel | null> {
        try {
            return await prisma.bodyMetric.update({
                where: { id: id },
                data: data
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) return null;

                if (error.code === PRISMA_ERRORS.UNIQUE_CONSTRAINT) {
                    throw new AppError('Metrics conflict detected', HTTP_STATUS.CONFLICT);
                }
            }
            throw error;
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            await prisma.bodyMetric.delete({
                where: { id: id }
            });
            return true;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === PRISMA_ERRORS.RECORD_NOT_FOUND) return false;
            }
            throw error;
        }
    }
}