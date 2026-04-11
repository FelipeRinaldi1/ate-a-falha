import { Result, failure, success } from './result.js'
import { z } from 'zod'

export function validateData<T extends z.ZodTypeAny>(
	schema: T,
	data: unknown,
	customMessage = 'Validation failed'
): Result<z.infer<T>> {
	const result = schema.safeParse(data)

	if (!result.success) {
		return failure({
			type: 'VALIDATION' as const,
			message: customMessage,
			details: result.error.issues,
		})
	}

	return success(result.data)
}
