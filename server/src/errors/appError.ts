/**
 * Custom error class used to standardize operational errors across the application.
 * Extends the built-in Error class to include an HTTP status code and additional data.
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly data: {};

    /**
     * Creates a new instance of AppError.
     * * @param message - The error message (default: 'Something went wrong').
     * @param statusCode - The HTTP status code associated with the error (default: 400).
     * @param data - Optional object containing additional details about the error.
     */
    constructor(message = 'Something went wrong', statusCode = 400, data = {}) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
