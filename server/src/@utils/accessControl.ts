import { AppError } from "./appError.js";
import { HTTP_STATUS } from "../@constants/global/httpCodesConstants.js";

export class AccessControl {
    public static ensureExists<T>(resource: T | null | undefined): void {
        if (!resource) {
            throw new AppError("Resource not found", HTTP_STATUS.NOT_FOUND);
        }
    }

    public static ensureOwnership(resource: { userId: string | null } | null | undefined, userId: string): void {
        AccessControl.ensureExists(resource);

        if (resource?.userId !== userId) {
            throw new AppError("You do not have permission to access this resource", HTTP_STATUS.FORBIDDEN);
        }
    }

    public static ensureWriteAccess(
        resource: { userId: string | null } | null | undefined, 
        userId: string, 
        userRole: string
    ): void {
        AccessControl.ensureExists(resource);

        const isGlobal = resource?.userId === null;
        const isOwner = resource?.userId === userId;
        const isAdmin = userRole === 'admin';

        if (isGlobal && !isAdmin) {
            throw new AppError("Only administrators can modify global resources", HTTP_STATUS.FORBIDDEN);
        }

        if (!isGlobal && !isOwner && !isAdmin) {
            throw new AppError("You do not have permission to modify this resource", HTTP_STATUS.FORBIDDEN);
        }
    }
}