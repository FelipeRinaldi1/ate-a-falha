import { Request, Response } from "express";
import { BodyMetricsService } from "../services/body-metrics.service.js";
import { sendSuccessResponse } from "../../../@utils/appErrorHelper.js";
import { HTTP_STATUS } from "../../../@constants/global/httpCodesConstants.js";

export class BodyMetricsController {
    constructor(private bodyMetricsService: BodyMetricsService) {}

    create = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const bodyMetricsData = { ...req.body, userId };

        const createdBodyMetrics = await this.bodyMetricsService.create(bodyMetricsData);

        return sendSuccessResponse(
            res,
            createdBodyMetrics,
            'Body metrics created successfully',
            HTTP_STATUS.CREATED
        );
    }
    
    getAllFromUser = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const bodyMetrics = await this.bodyMetricsService.findByUserId(userId);

        return sendSuccessResponse(
            res,
            bodyMetrics,
            'Body metrics retrieved successfully',
            HTTP_STATUS.OK
        );
    }

    getLatestFromUser = async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const bodyMetrics = await this.bodyMetricsService.findLatestByUserId(userId);

        return sendSuccessResponse(
            res,
            bodyMetrics || undefined,
            'Latest body metrics retrieved successfully',
            HTTP_STATUS.OK
        );
    }

    getById = async (req: Request, res: Response) => {
        const bodyMetricsId = req.params.id;
        const bodyMetrics = await this.bodyMetricsService.findById(bodyMetricsId);

        return sendSuccessResponse(
            res,
            bodyMetrics || undefined,
            'Body metrics retrieved successfully',
            HTTP_STATUS.OK
        );
    }

    update = async (req: Request, res: Response) => {
        const bodyMetricsId = req.params.id;
        const bodyMetricsData = req.body;
        
        const updatedBodyMetrics = await this.bodyMetricsService.update(bodyMetricsId, bodyMetricsData);

        return sendSuccessResponse(
            res,
            updatedBodyMetrics || undefined,
            'Body metrics updated successfully',
            HTTP_STATUS.OK
        );
    }

    delete = async (req: Request, res: Response) => {
        const bodyMetricsId = req.params.id;
        await this.bodyMetricsService.delete(bodyMetricsId);

        return sendSuccessResponse(
            res,
            {},
            'Body metrics deleted successfully',
            HTTP_STATUS.OK
        );
    }
}