import { Result, failure,success } from './result.js';
import {z} from 'zod'

export function validateData<T>(
    schema: z.Schema<T>, 
    data: unknown, 
    customMessage = 'Validation failed'
): Result<T> { 
    const result = schema.safeParse(data);
    
    if (!result.success) {
        return failure({ 
            type: 'VALIDATION',
            message: customMessage,
            details: result.error.issues 
        });
    }

    return success(result.data);
}