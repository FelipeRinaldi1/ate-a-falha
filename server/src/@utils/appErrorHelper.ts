import { Response } from "express";
import { AppError } from "../errors/appError.js";

/**
 * Sends a standardized success JSON response to the client.
 * * @param res - The Express Response object.
 * @param data - The payload to return to the client (default: {}).
 * @param message - A human-readable success message (default: 'Success').
 * @param statusCode - The HTTP status code (default: 200).
 * @returns The Express response with a standard structure: { success: true, message, data }.
 */
export const sendSuccessResponse = (res: Response, data = {}, message = "Success", statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
}

/**
 * Handles errors and sends a standardized error JSON response.
 * Checks if the error is an instance of AppError to use specific status codes and messages.
 * Otherwise, defaults to Internal Server Error (500).
 * * @param res - The Express Response object.
 * @param error - The error object caught in the try/catch block (Error or AppError).
 * @returns The Express response with a standard structure: { success: false, message, data }.
 */
export const sendErrorResponse = (res: Response, error: Error | AppError) => {
    let statusCode = 500;
    let message = error.message;
    let data = {};

    // Check if the error is a trusted operational error
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        data = error.data;
    }

    if(statusCode ===500){
        console.log(error);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        data
    });
}