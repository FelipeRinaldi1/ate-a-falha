export class AppError extends Error {
    public readonly statusCode: number;
    public readonly data: {};

    constructor(message = 'Something went wrong', statusCode = 400, data = {}) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
    }
}
